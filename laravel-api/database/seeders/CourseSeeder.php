<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            ['أساسيات HTML وCSS', 'html-css-foundations', 'web', 'beginner', 480],
            ['JavaScript من الصفر', 'javascript-from-zero', 'frontend', 'beginner', 840],
            ['React للتطبيقات الحديثة', 'modern-react-applications', 'frontend', 'intermediate', 1080],
            ['واجهات Laravel API', 'laravel-api-development', 'backend', 'intermediate', 960],
            ['الخوارزميات وهياكل البيانات', 'algorithms-data-structures', 'computer-science', 'intermediate', 900],
            ['قواعد البيانات وSQL', 'databases-and-sql', 'databases', 'beginner', 720],
            ['أساسيات الأمن السيبراني', 'cybersecurity-foundations', 'cybersecurity', 'beginner', 780],
            ['Docker وعمليات DevOps', 'docker-devops', 'devops', 'intermediate', 660],
            ['الحوسبة السحابية', 'cloud-computing', 'cloud', 'beginner', 600],
            ['تطوير تطبيقات الهاتف', 'mobile-app-development', 'mobile', 'intermediate', 840],
            ['اختبار البرمجيات وضمان الجودة', 'software-testing-qa', 'testing', 'intermediate', 600],
            ['مشروع Full Stack تطبيقي', 'practical-full-stack-project', 'projects', 'advanced', 1320],
        ];

        foreach ($courses as [$title, $slug, $category, $level, $duration]) {
            $course = Course::updateOrCreate(
                ['slug' => $slug],
                [
                    'title' => $title,
                    'description' => 'دورة تطبيقية منظمة تجمع الشرح المركز والتمارين والمشروع العملي.',
                    'category' => $category,
                    'level' => $level,
                    'duration_minutes' => $duration,
                    'published' => true,
                ],
            );

            foreach (range(1, 6) as $position) {
                $course->lessons()->updateOrCreate(
                    ['slug' => "lesson-{$position}"],
                    [
                        'title' => "الدرس {$position}",
                        'content' => 'محتوى الدرس وخطوات التطبيق العملي.',
                        'duration_seconds' => 720,
                        'position' => $position,
                        'is_preview' => $position === 1,
                    ],
                );
            }
        }
    }
}
