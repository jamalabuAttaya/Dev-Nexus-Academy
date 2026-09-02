<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LearningFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_learner_can_enroll_access_and_complete_a_course(): void
    {
        $user = User::factory()->create();

        $course = Course::create([
            'title' => 'Test Course',
            'slug' => 'test-course',
            'description' => 'A production-like course fixture.',
            'category' => 'testing',
            'level' => 'beginner',
            'duration_minutes' => 60,
            'published' => true,
        ]);

        $lesson = Lesson::create([
            'course_id' => $course->id,
            'title' => 'First lesson',
            'slug' => 'first-lesson',
            'content' => 'Protected lesson content.',
            'video_url' => 'https://www.youtube.com/watch?v=gmuTjeQUbTM',
            'duration_seconds' => 600,
            'position' => 1,
            'is_preview' => false,
        ]);

        $token = $user
            ->createToken('phpunit')
            ->plainTextToken;

        $this->withToken($token)
            ->postJson("/api/v1/courses/{$course->id}/enroll")
            ->assertCreated();

        $this->withToken($token)
            ->getJson(
                "/api/v1/courses/{$course->slug}/learning",
            )
            ->assertOk()
            ->assertJsonPath('course.id', $course->id)
            ->assertJsonPath(
                'lesson_progress.0.completed',
                false,
            );

        $this->withToken($token)
            ->getJson("/api/v1/lessons/{$lesson->id}")
            ->assertOk()
            ->assertJsonPath(
                'lesson.content',
                'Protected lesson content.',
            )
            ->assertJsonPath(
                'can_update_progress',
                true,
            );

        $this->withToken($token)
            ->putJson(
                "/api/v1/lessons/{$lesson->id}/progress",
                [
                    'watched_seconds' => 600,
                    'completed' => true,
                ],
            )
            ->assertOk()
            ->assertJsonPath(
                'course_progress_percent',
                100,
            )
            ->assertJsonPath(
                'lesson_progress.completed',
                true,
            );

        // Completed progress must not move backwards.
        $this->withToken($token)
            ->putJson(
                "/api/v1/lessons/{$lesson->id}/progress",
                [
                    'watched_seconds' => 0,
                    'completed' => false,
                ],
            )
            ->assertOk()
            ->assertJsonPath(
                'course_progress_percent',
                100,
            )
            ->assertJsonPath(
                'lesson_progress.watched_seconds',
                600,
            )
            ->assertJsonPath(
                'lesson_progress.completed',
                true,
            );

        $this->withToken($token)
            ->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath(
                'stats.completed_courses',
                1,
            )
            ->assertJsonPath(
                'stats.average_progress',
                100,
            );
    }

    public function test_preview_access_and_locked_lesson_permissions(): void
    {
        $user = User::factory()->create();

        $course = Course::create([
            'title' => 'Permission Course',
            'slug' => 'permission-course',
            'description' => 'Tests lesson permissions.',
            'category' => 'testing',
            'level' => 'beginner',
            'duration_minutes' => 30,
            'published' => true,
        ]);

        $previewLesson = Lesson::create([
            'course_id' => $course->id,
            'title' => 'Preview lesson',
            'slug' => 'preview-lesson',
            'content' => 'Public preview content.',
            'duration_seconds' => 300,
            'position' => 1,
            'is_preview' => true,
        ]);

        $lockedLesson = Lesson::create([
            'course_id' => $course->id,
            'title' => 'Locked lesson',
            'slug' => 'locked-lesson',
            'content' => 'Enrolled learners only.',
            'duration_seconds' => 300,
            'position' => 2,
            'is_preview' => false,
        ]);

        $token = $user
            ->createToken('phpunit')
            ->plainTextToken;

        $this->withToken($token)
            ->getJson(
                "/api/v1/lessons/{$previewLesson->id}",
            )
            ->assertOk()
            ->assertJsonPath('enrolled', false)
            ->assertJsonPath(
                'can_update_progress',
                false,
            );

        $this->withToken($token)
            ->getJson(
                "/api/v1/lessons/{$lockedLesson->id}",
            )
            ->assertForbidden();

        $this->withToken($token)
            ->getJson(
                "/api/v1/courses/{$course->slug}/learning",
            )
            ->assertForbidden();

        $this->withToken($token)
            ->putJson(
                "/api/v1/lessons/{$previewLesson->id}/progress",
                [
                    'watched_seconds' => 120,
                    'completed' => false,
                ],
            )
            ->assertForbidden();
    }
}
