# Dev Nexus Academy API

REST API مستقل مبني باستخدام Laravel 13 وLaravel Sanctum.

## الوظائف

- تسجيل المستخدمين وتسجيل الدخول والخروج.
- عرض الدورات والدروس والبحث والتصفية.
- الالتحاق بالدورات وتحديث تقدم الدروس.
- لوحة بيانات للطالب.
- كتالوج موحد للكتب والكورسات والمقالات.
- تخزين مؤقت لنتائج الخدمات الخارجية.

## التشغيل على Windows

من داخل مجلد `laravel-api`:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\setup-windows.ps1
php artisan serve --host=127.0.0.1 --port=8000
```

يستخدم الإعداد المحلي SQLite افتراضيًا، ويُنشئ ملف قاعدة البيانات تلقائيًا.

## التشغيل اليدوي

```powershell
Copy-Item .env.example .env
New-Item -ItemType File -Force database\database.sqlite | Out-Null
composer install --prefer-dist --no-dev --no-interaction --optimize-autoloader
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

عنوان API الافتراضي:

```text
http://127.0.0.1:8000/api/v1
```

## المصادقة

تستخدم المسارات المحمية Bearer Token من Laravel Sanctum:

```http
Authorization: Bearer YOUR_TOKEN
Accept: application/json
```

## المسارات الرئيسية

| Method | Path | Authentication |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | Public |
| POST | `/api/v1/auth/login` | Public |
| POST | `/api/v1/auth/logout` | Sanctum |
| GET | `/api/v1/me` | Sanctum |
| GET | `/api/v1/courses` | Public |
| GET | `/api/v1/courses/{slug}` | Public |
| GET | `/api/v1/catalog/books?search=javascript` | Public |
| GET | `/api/v1/catalog/courses?search=react` | Public |
| GET | `/api/v1/catalog/articles?search=webdev` | Public |
| GET | `/api/v1/catalog/articles/{id}` | Public |
| GET | `/api/v1/dashboard` | Sanctum |
| POST | `/api/v1/courses/{course}/enroll` | Sanctum |
| PUT | `/api/v1/lessons/{lesson}/progress` | Sanctum |

## الخدمات الخارجية

- Open Library وInternet Archive للكتب العامة المجانية.
- DEV Community API للمقالات.
- YouTube Data API للبحث المباشر عند توفير `YOUTUBE_API_KEY`.

عند عدم توفير مفتاح YouTube، يعيد الخادم مجموعة كورسات منسقة داخل المشروع.

## الإنتاج

- اضبط `APP_DEBUG=false`.
- استخدم MySQL أو PostgreSQL.
- حدّد عناوين الواجهة المسموحة في `FRONTEND_URLS`.
- خزّن المفاتيح وكلمات المرور في متغيرات البيئة.
