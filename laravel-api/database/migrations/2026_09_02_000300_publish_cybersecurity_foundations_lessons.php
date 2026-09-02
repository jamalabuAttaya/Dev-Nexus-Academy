<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $courseId = DB::table('courses')
            ->where('slug', 'cybersecurity-foundations')
            ->value('id');

        if (! $courseId) {
            return;
        }

        foreach ($this->lessons() as $index => $lesson) {
            $values = [
                'title' => $lesson['title'],
                'content' => $lesson['content'],
                'video_url' => $lesson['video_url'],
                'duration_seconds' => $lesson['duration_seconds'],
                'position' => $index + 1,
                'is_preview' => $index === 0,
                'updated_at' => now(),
            ];

            $query = DB::table('lessons')
                ->where('course_id', $courseId)
                ->where('slug', $lesson['slug']);

            if ($query->exists()) {
                $query->update($values);

                continue;
            }

            DB::table('lessons')->insert([
                'course_id' => $courseId,
                'slug' => $lesson['slug'],
                ...$values,
                'created_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        $courseId = DB::table('courses')
            ->where('slug', 'cybersecurity-foundations')
            ->value('id');

        if (! $courseId) {
            return;
        }

        foreach (range(1, 6) as $position) {
            DB::table('lessons')
                ->where('course_id', $courseId)
                ->where('slug', "lesson-{$position}")
                ->update([
                    'title' => "الدرس {$position}",
                    'content' => 'محتوى الدرس وخطوات التطبيق العملي.',
                    'video_url' => null,
                    'duration_seconds' => 720,
                    'position' => $position,
                    'is_preview' => $position === 1,
                    'updated_at' => now(),
                ]);
        }
    }

    private function lessons(): array
    {
        return [
            [
                'slug' => 'lesson-1',
                'title' => 'مبادئ الأمن السيبراني والتشفير',
                'content' => 'يشرح هذا الدرس أهداف الأمن السيبراني: السرية والسلامة والتوافر، وكيف يحدد نموذج التهديد الأصول والمهاجمين ونقاط الضعف. شاهد شرح التشفير بالمفتاح العام، ثم دوّن أصلًا رقميًا واحدًا تريد حمايته والتهديد الأكثر واقعية له.',
                'video_url' => 'https://www.youtube.com/watch?v=GSIDS_lvRv4',
                'duration_seconds' => 720,
            ],
            [
                'slug' => 'lesson-2',
                'title' => 'كلمات المرور والمصادقة الآمنة',
                'content' => 'تتعلم لماذا يكون طول كلمة المرور وتفرّدها أهم من التعقيد الشكلي، ولماذا يجب استخدام مدير كلمات مرور والمصادقة متعددة العوامل. التطبيق العملي: أنشئ عبارة مرور طويلة وفريدة وفعّل العامل الثاني في حساب تجريبي.',
                'video_url' => 'https://www.youtube.com/watch?v=3NjQ9b3pgIg',
                'duration_seconds' => 660,
            ],
            [
                'slug' => 'lesson-3',
                'title' => 'كيف تُكسر كلمات المرور وكيف نحميها',
                'content' => 'يعرض الدرس الفرق بين التخمين المباشر وكسر التجزئات المسربة، ودور الملح وخوارزميات التجزئة البطيئة وحدود المحاولات. ركّز على الدفاع: لا تخزّن كلمة المرور كنص صريح، واستخدم خوارزمية مخصصة مثل Argon2id أو bcrypt.',
                'video_url' => 'https://www.youtube.com/watch?v=7U-RbOKanYs',
                'duration_seconds' => 780,
            ],
            [
                'slug' => 'lesson-4',
                'title' => 'أمن تطبيقات الويب وحقن SQL',
                'content' => 'تتعرف إلى سبب ظهور ثغرة حقن SQL عندما تُدمج مدخلات المستخدم داخل الاستعلام، وكيف تمنعها الاستعلامات المعلّمة والتحقق من المدخلات وأقل الصلاحيات. جرّب فقط داخل مختبر مصرح به، ولا تختبر أي نظام لا تملكه.',
                'video_url' => 'https://www.youtube.com/watch?v=ciNHn38EyRc',
                'duration_seconds' => 1020,
            ],
            [
                'slug' => 'lesson-5',
                'title' => 'سلامة الذاكرة وثغرات تجاوز السعة',
                'content' => 'يوضح الدرس كيف قد تسمح الكتابة خارج حدود الذاكرة بتعطيل البرنامج أو تغيير مسار التنفيذ، ثم يربط ذلك بالبرمجة الدفاعية وفحص الحدود وتحديث التبعيات ووسائل الحماية الحديثة. نفّذ الأمثلة في بيئة محلية تعليمية فقط.',
                'video_url' => 'https://www.youtube.com/watch?v=1S0aBV-Waeo',
                'duration_seconds' => 900,
            ],
            [
                'slug' => 'lesson-6',
                'title' => 'برمجيات الفدية والاستجابة للحوادث',
                'content' => 'تتعلم كيف تستخدم برمجيات الفدية التشفير، ولماذا تقلل النسخ الاحتياطية المعزولة والتحديثات وتقسيم الشبكة من أثرها. اختم الدورة بخطة استجابة مختصرة: عزل الجهاز، حفظ الأدلة، الإبلاغ، الاستعادة من نسخة موثوقة، ثم مراجعة سبب الاختراق.',
                'video_url' => 'https://www.youtube.com/watch?v=pLluFxHrc30',
                'duration_seconds' => 840,
            ],
        ];
    }
};
