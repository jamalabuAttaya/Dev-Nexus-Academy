<?php

namespace Tests\Feature;

use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_published_courses_are_listed(): void
    {
        Course::create([
            'title' => 'Published Course',
            'slug' => 'published-course',
            'description' => 'Visible course.',
            'category' => 'web',
            'level' => 'beginner',
            'duration_minutes' => 120,
            'published' => true,
        ]);
        Course::create([
            'title' => 'Draft Course',
            'slug' => 'draft-course',
            'description' => 'Hidden course.',
            'category' => 'web',
            'level' => 'beginner',
            'duration_minutes' => 120,
            'published' => false,
        ]);

        $this->getJson('/api/v1/courses')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'published-course');

        $this->getJson('/api/v1/courses/draft-course')->assertNotFound();
    }
}
