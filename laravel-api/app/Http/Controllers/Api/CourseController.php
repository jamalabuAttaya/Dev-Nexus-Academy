<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CourseController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $data = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:60'],
            'level' => ['nullable', 'in:beginner,intermediate,advanced'],
            'per_page' => ['nullable', 'integer', 'between:1,24'],
        ]);

        $courses = Course::query()
            ->published()
            ->withCount('lessons')
            ->when($data['search'] ?? null, fn ($query, $search) => $query->where(function ($query) use ($search): void {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            }))
            ->when($data['category'] ?? null, fn ($query, $category) => $query->where('category', $category))
            ->when($data['level'] ?? null, fn ($query, $level) => $query->where('level', $level))
            ->latest()
            ->paginate($data['per_page'] ?? 12)
            ->withQueryString();

        return CourseResource::collection($courses);
    }

    public function show(Course $course): CourseResource
    {
        abort_unless($course->published, 404);

        return new CourseResource($course->load('lessons')->loadCount('lessons'));
    }
}
