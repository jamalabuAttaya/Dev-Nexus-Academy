<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LearningController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $enrollments = Enrollment::query()
            ->where('user_id', $request->user()->id)
            ->with('course:id,title,slug,thumbnail_url,level')
            ->latest('enrolled_at')
            ->get();

        return response()->json([
            'stats' => [
                'active_courses' => $enrollments
                    ->where('status', 'active')
                    ->count(),
                'completed_courses' => $enrollments
                    ->where('status', 'completed')
                    ->count(),
                'average_progress' => (int) round(
                    $enrollments->avg('progress_percent') ?? 0,
                ),
            ],
            'enrollments' => $enrollments,
        ]);
    }

    public function enroll(
        Request $request,
        Course $course,
    ): JsonResponse {
        abort_unless($course->published, 404);

        $enrollment = Enrollment::firstOrCreate(
            [
                'user_id' => $request->user()->id,
                'course_id' => $course->id,
            ],
            [
                'status' => 'active',
                'progress_percent' => 0,
                'enrolled_at' => now(),
            ],
        );

        return response()->json([
            'message' => $enrollment->wasRecentlyCreated
                ? 'تم الالتحاق بالدورة.'
                : 'أنت ملتحق بهذه الدورة بالفعل.',
            'enrollment' => $enrollment->load(
                'course:id,title,slug',
            ),
        ], $enrollment->wasRecentlyCreated ? 201 : 200);
    }

    public function course(
        Request $request,
        Course $course,
    ): JsonResponse {
        abort_unless($course->published, 404);

        $enrollment = Enrollment::query()
            ->where('user_id', $request->user()->id)
            ->where('course_id', $course->id)
            ->first();

        abort_unless(
            $enrollment,
            403,
            'يجب الالتحاق بالدورة للوصول إلى محتواها.',
        );

        $course->load('lessons')->loadCount('lessons');

        $progressByLesson = LessonProgress::query()
            ->where('user_id', $request->user()->id)
            ->whereIn('lesson_id', $course->lessons->pluck('id'))
            ->get()
            ->keyBy('lesson_id');

        $lessonProgress = $course->lessons
            ->map(function (Lesson $lesson) use ($progressByLesson): array {
                $progress = $progressByLesson->get($lesson->id);

                return [
                    'lesson_id' => $lesson->id,
                    'watched_seconds' => (int) (
                        $progress?->watched_seconds ?? 0
                    ),
                    'completed' => $progress?->completed_at !== null,
                    'completed_at' => $progress?->completed_at?->toISOString(),
                ];
            })
            ->values();

        return response()->json([
            'course' => (new CourseResource($course))
                ->resolve($request),
            'enrollment' => [
                'id' => $enrollment->id,
                'status' => $enrollment->status,
                'progress_percent' => $enrollment->progress_percent,
                'enrolled_at' => $enrollment
                    ->enrolled_at
                    ?->toISOString(),
                'completed_at' => $enrollment
                    ->completed_at
                    ?->toISOString(),
            ],
            'lesson_progress' => $lessonProgress,
        ]);
    }

    public function lesson(
        Request $request,
        Lesson $lesson,
    ): JsonResponse {
        $lesson->load('course:id,title,slug,published');

        abort_unless(
            $lesson->course && $lesson->course->published,
            404,
        );

        $enrollment = Enrollment::query()
            ->where('user_id', $request->user()->id)
            ->where('course_id', $lesson->course_id)
            ->first();

        abort_unless(
            $lesson->is_preview || $enrollment,
            403,
            'يجب الالتحاق بالدورة لفتح هذا الدرس.',
        );

        $progress = LessonProgress::query()
            ->where('user_id', $request->user()->id)
            ->where('lesson_id', $lesson->id)
            ->first();

        return response()->json([
            'lesson' => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'slug' => $lesson->slug,
                'content' => $lesson->content,
                'video_url' => $lesson->video_url,
                'duration_seconds' => $lesson->duration_seconds,
                'position' => $lesson->position,
                'is_preview' => $lesson->is_preview,
                'course' => [
                    'id' => $lesson->course->id,
                    'title' => $lesson->course->title,
                    'slug' => $lesson->course->slug,
                ],
            ],
            'progress' => [
                'watched_seconds' => (int) (
                    $progress?->watched_seconds ?? 0
                ),
                'completed' => $progress?->completed_at !== null,
                'completed_at' => $progress
                    ?->completed_at
                    ?->toISOString(),
            ],
            'enrolled' => $enrollment !== null,
            'can_update_progress' => $enrollment !== null,
        ]);
    }

    public function updateProgress(
        Request $request,
        Lesson $lesson,
    ): JsonResponse {
        $data = $request->validate([
            'watched_seconds' => [
                'required',
                'integer',
                'min:0',
                'max:86400',
            ],
            'completed' => ['required', 'boolean'],
        ]);

        $course = $lesson->course()->first();

        abort_unless($course && $course->published, 404);

        [$progress, $progressPercent] = DB::transaction(
            function () use ($request, $lesson, $data): array {
                $enrollment = Enrollment::query()
                    ->where('user_id', $request->user()->id)
                    ->where('course_id', $lesson->course_id)
                    ->lockForUpdate()
                    ->first();

                abort_unless(
                    $enrollment,
                    403,
                    'يجب الالتحاق بالدورة لحفظ التقدم.',
                );

                $progress = LessonProgress::firstOrNew([
                    'user_id' => $request->user()->id,
                    'lesson_id' => $lesson->id,
                ]);

                $duration = max(
                    (int) $lesson->duration_seconds,
                    0,
                );

                $watchedSeconds = $duration > 0
                    ? min((int) $data['watched_seconds'], $duration)
                    : (int) $data['watched_seconds'];

                $progress->watched_seconds = max(
                    (int) $progress->watched_seconds,
                    $watchedSeconds,
                );

                if (
                    $data['completed'] &&
                    $progress->completed_at === null
                ) {
                    $progress->completed_at = now();
                }

                $progress->save();

                $lessonCount = Lesson::query()
                    ->where('course_id', $lesson->course_id)
                    ->count();

                $completedCount = LessonProgress::query()
                    ->where('user_id', $request->user()->id)
                    ->whereNotNull('completed_at')
                    ->whereHas(
                        'lesson',
                        fn ($query) => $query->where(
                            'course_id',
                            $lesson->course_id,
                        ),
                    )
                    ->count();

                $progressPercent = $lessonCount > 0
                    ? (int) round(
                        ($completedCount / $lessonCount) * 100,
                    )
                    : 0;

                $courseCompleted = $progressPercent === 100;

                $enrollment->update([
                    'progress_percent' => $progressPercent,
                    'status' => $courseCompleted
                        ? 'completed'
                        : 'active',
                    'completed_at' => $courseCompleted
                        ? ($enrollment->completed_at ?? now())
                        : null,
                ]);

                return [$progress->fresh(), $progressPercent];
            },
        );

        return response()->json([
            'message' => 'تم حفظ التقدم.',
            'lesson_progress' => [
                'lesson_id' => $progress->lesson_id,
                'watched_seconds' => $progress->watched_seconds,
                'completed' => $progress->completed_at !== null,
                'completed_at' => $progress
                    ->completed_at
                    ?->toISOString(),
            ],
            'course_progress_percent' => $progressPercent,
        ]);
    }
}
