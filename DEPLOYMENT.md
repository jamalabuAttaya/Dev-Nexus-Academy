# Production deployment

يتكون المنتج من خدمتين:

| الجزء            | مكان النشر                       | المتغير الأساسي                      |
| ---------------- | -------------------------------- | ------------------------------------ |
| واجهة Next.js    | Vercel                           | `NEXT_PUBLIC_API_URL`                |
| Laravel REST API | Laravel Cloud أو خادم PHP/Docker | `APP_KEY`, `DB_URL`, `FRONTEND_URLS` |

## 1. التحقق قبل الرفع

```powershell
npm ci
npm run check
cd laravel-api
composer install --prefer-dist --no-interaction
composer validate
php artisan test
```

يولّد Composer ملف `composer.lock` إذا لم يكن موجودًا. أضفه إلى المستودع لضمان تثبيت الإصدارات نفسها.

## 2. رفع المشروع إلى GitHub

أنشئ مستودعًا فارغًا باسم `Dev-Nexus-Academy`، ولا تطلب من GitHub إنشاء README أو `.gitignore`.

```powershell
git init
git add .
git commit -m "Release Dev Nexus Academy 1.1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Dev-Nexus-Academy.git
git push -u origin main
```

تحقق من نجاح وظيفتي `Next.js` و`Laravel API` في تبويب Actions.

## 3. نشر Laravel API

انشر الخلفية أولًا للحصول على رابط API. استخدم Laravel Cloud أو خدمة تدعم Docker وPostgreSQL. يوجد `laravel-api/Dockerfile` جاهز.

1. اجعل Docker context هو `laravel-api`.
2. أنشئ قاعدة PostgreSQL دائمة.
3. ولّد مفتاحًا بالأمر `php artisan key:generate --show`.
4. أضف متغيرات `laravel-api/.env.production.example` في لوحة الاستضافة.
5. ضع رابط قاعدة البيانات في `DB_URL`.
6. اجعل `RUN_MIGRATIONS=true` دائمًا، و`RUN_SEEDERS=true` في أول نشر فقط ثم أعده إلى `false`.

تحقق من:

```text
https://api.your-domain.com/up
https://api.your-domain.com/api/v1/courses
```

## 4. نشر الواجهة على Vercel

1. اختر **Add New → Project** واستورد مستودع GitHub.
2. اترك **Root Directory** على جذر المستودع `.`.
3. أضف:

```env
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api/v1
```

4. نفّذ Deploy.
5. حدّث Laravel بعد ظهور رابط Vercel:

```env
FRONTEND_URLS=https://your-project.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-project.vercel.app
```

## 5. فحص ما بعد النشر

- افتح الرئيسية والكورسات والكتب والمقالات وخرائط الطريق والحساب.
- جرّب العربية والإنجليزية على الهاتف وسطح المكتب.
- أنشئ حساب اختبار، سجّل الدخول ثم سجّل الخروج.
- تحقق من `/robots.txt`, `/sitemap.xml`, و`/manifest.webmanifest`.
- تحقق من الشعار وأيقونة التبويب.
- راجع سجلات Vercel وLaravel وتأكد من عدم وجود أخطاء 500.
