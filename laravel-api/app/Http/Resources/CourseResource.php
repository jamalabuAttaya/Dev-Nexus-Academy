<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'category' => $this->category,
            'level' => $this->level,
            'duration_minutes' => $this->duration_minutes,
            'thumbnail_url' => $this->thumbnail_url,
            'lessons_count' => $this->whenCounted('lessons'),
            'lessons' => $this->whenLoaded('lessons', fn () => $this->lessons->map(fn ($lesson) => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'slug' => $lesson->slug,
                'duration_seconds' => $lesson->duration_seconds,
                'position' => $lesson->position,
                'is_preview' => $lesson->is_preview,
            ])),
        ];
    }
}
