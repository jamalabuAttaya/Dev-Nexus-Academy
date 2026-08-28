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

    public function test_a_learner_can_enroll_and_complete_a_course(): void
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
            'duration_seconds' => 600,
            'position' => 1,
            'is_preview' => true,
        ]);
        $token = $user->createToken('phpunit')->plainTextToken;

        $this->withToken($token)
            ->postJson("/api/v1/courses/{$course->id}/enroll")
            ->assertCreated();

        $this->withToken($token)
            ->putJson("/api/v1/lessons/{$lesson->id}/progress", [
                'watched_seconds' => 600,
                'completed' => true,
            ])
            ->assertOk()
            ->assertJsonPath('course_progress_percent', 100);

        $this->withToken($token)
            ->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath('stats.completed_courses', 1)
            ->assertJsonPath('stats.average_progress', 100);
    }
}
