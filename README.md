# Dev Nexus Academy

منصة تقنية ثنائية اللغة مبنية بواجهة Next.js وخلفية Laravel REST API مستقلة. تنظّم الكورسات والكتب العامة والمقالات وخرائط الطريق ضمن تجربة عربية وإنجليزية متجاوبة.

## نظرة عامة

- 20 قسمًا تقنيًا رسميًا و37 مادة فيديو منسقة موزعة على 140 موضعًا تعليميًا.
- 16 خريطة طريق ثنائية اللغة و96 مرحلة تعلم.
- مكتبة كتب وصول عام عبر Open Library وInternet Archive.
- قارئ مقالات من DEV Community مع إظهار الكاتب والمصدر.
- حساب متعلم وتسجيل دخول وتتبع للالتحاقات والتقدم عبر Laravel Sanctum.
- دعم كامل للعربية والإنجليزية واتجاهي RTL وLTR.
- صفحات تعريف ودعم وسياسات محتوى وخصوصية وشروط وإمكانية وصول.
- SEO وSitemap وRobots وWeb App Manifest وهوية بصرية متكاملة.
- فحوص تلقائية للواجهة وAPI عبر GitHub Actions.

## التقنيات

- Next.js 16، React 19، TypeScript 5، Tailwind CSS 4.
- Laravel 13، PHP 8.4، Laravel Sanctum.
- SQLite للتطوير المحلي، وPostgreSQL أو MySQL للإنتاج.
- Vercel للواجهة، وخادم PHP أو Docker مستقل لخدمة Laravel.

## التشغيل السريع على Windows

ضع المشروع في مسار بسيط قابل للكتابة، مثل:

```text
C:\Users\YOUR_NAME\Projects\Dev-Nexus-Academy
```

ثم افتح PowerShell داخل مجلد المشروع ونفّذ:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\setup-windows.ps1
.\start-windows.ps1
```

افتح بعدها:

- الواجهة: `http://localhost:3000`
- فحص API: `http://127.0.0.1:8000/up`
- مسارات API: `http://127.0.0.1:8000/api/v1`

## التشغيل اليدوي

### الواجهة

```powershell
Copy-Item .env.example .env.local
npm ci
npm run dev
```

### Laravel API

```powershell
cd laravel-api
Copy-Item .env.example .env
New-Item -ItemType File -Force database\database.sqlite | Out-Null
composer install --prefer-dist --no-interaction
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

احتفظ بملف `laravel-api/composer.lock` الذي ينشئه Composer وأضفه إلى Git قبل أول نشر للإنتاج.

## فحوص الجودة

```powershell
npm run check
```

وفي مجلد `laravel-api`:

```powershell
composer validate
php artisan test
```

## النشر

دليل GitHub وVercel وخدمة Laravel الخلفية موجود في [DEPLOYMENT.md](DEPLOYMENT.md). واجهة Next.js تُنشر على Vercel، بينما Laravel يحتاج بيئة PHP أو Docker وقاعدة بيانات مستقلة.

## متغيرات البيئة

- الواجهة: `.env.example` محليًا و`.env.production.example` للإنتاج.
- الخلفية: `laravel-api/.env.example` محليًا و`laravel-api/.env.production.example` للإنتاج.
- لا ترفع أي ملف `.env` حقيقي أو مفتاح خدمة أو كلمة مرور إلى GitHub.

## المساهمة والأمان

- [دليل المساهمة](CONTRIBUTING.md)
- [سياسة الأمان](SECURITY.md)
- [قواعد المجتمع](CODE_OF_CONDUCT.md)

## الترخيص والمطور

المشروع متاح وفق ترخيص [MIT](LICENSE). حقوق المصادر الخارجية تبقى لأصحابها.

تطوير Jamal Abu Attaya — [Portfolio](https://jamalabuattaya-portfolio.netlify.app)
