<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
                'active_courses' => $enrollments->where('status', 'active')->count(),
                'completed_courses' => $enrollments->where('status', 'completed')->count(),
                'average_progress' => (int) round($enrollments->avg('progress_percent') ?? 0),
            ],
            'enrollments' => $enrollments,
        ]);
    }

    public function enroll(Request $request, Course $course): JsonResponse
    {
        abort_unless($course->published, 404);

        $enrollment = Enrollment::firstOrCreate(
            ['user_id' => $request->user()->id, 'course_id' => $course->id],
            ['status' => 'active', 'progress_percent' => 0, 'enrolled_at' => now()],
        );

        return response()->json([
            'message' => $enrollment->wasRecentlyCreated ? 'تم الالتحاق بالدورة.' : 'أنت ملتحق بهذه الدورة بالفعل.',
            'enrollment' => $enrollment->load('course:id,title,slug'),
        ], $enrollment->wasRecentlyCreated ? 201 : 200);
    }

    public function updateProgress(Request $request, Lesson $lesson): JsonResponse
    {
        $data = $request->validate([
            'watched_seconds' => ['required', 'integer', 'min:0'],
            'completed' => ['required', 'boolean'],
        ]);

        $enrollment = Enrollment::query()
            ->where('user_id', $request->user()->id)
            ->where('course_id', $lesson->course_id)
            ->firstOrFail();

        [$progress, $progressPercent] = DB::transaction(function () use ($request, $lesson, $data, $enrollment): array {
            $progress = LessonProgress::updateOrCreate(
                ['user_id' => $request->user()->id, 'lesson_id' => $lesson->id],
                [
                    'watched_seconds' => $data['watched_seconds'],
                    'completed_at' => $data['completed'] ? now() : null,
                ],
            );

            $lessonCount = Lesson::where('course_id', $lesson->course_id)->count();
            $completedCount = LessonProgress::query()
                ->where('user_id', $request->user()->id)
                ->whereNotNull('completed_at')
                ->whereHas('lesson', fn ($query) => $query->where('course_id', $lesson->course_id))
                ->count();
            $progressPercent = $lessonCount > 0 ? (int) round(($completedCount / $lessonCount) * 100) : 0;

            $enrollment->update([
                'progress_percent' => $progressPercent,
                'status' => $progressPercent === 100 ? 'completed' : 'active',
                'completed_at' => $progressPercent === 100 ? now() : null,
            ]);

            return [$progress, $progressPercent];
        });

        return response()->json([
            'message' => 'تم حفظ التقدم.',
            'lesson_progress' => $progress,
            'course_progress_percent' => $progressPercent,
        ]);
    }
}
