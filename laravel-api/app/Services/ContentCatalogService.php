<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ContentCatalogService
{
    public function books(string $search): array
    {
        $search = $search ?: 'programming';

        return Cache::remember('catalog:books:'.sha1($search), now()->addMinutes(30), function () use ($search): array {
            $payload = Http::withHeaders($this->publicHeaders())
                ->retry(2, 250)
                ->timeout(8)
                ->get('https://openlibrary.org/search.json', [
                    'q' => $search,
                    'has_fulltext' => 'true',
                    'public_scan_b' => 'true',
                    'fields' => 'key,title,author_name,first_publish_year,cover_i,ia,ebook_access,public_scan_b,has_fulltext,subject',
                    'limit' => 40,
                ])
                ->throw()
                ->json();

            return collect($payload['docs'] ?? [])
                ->filter(fn (array $book): bool => Arr::get($book, 'ebook_access') === 'public'
                    && (bool) Arr::get($book, 'public_scan_b', false)
                    && (bool) Arr::get($book, 'has_fulltext', false)
                    && filled(Arr::first(Arr::get($book, 'ia', []))))
                ->map(function (array $book): array {
                    $archiveId = Arr::first(Arr::get($book, 'ia', []));
                    $coverId = Arr::get($book, 'cover_i');

                    return [
                'id' => $book['key'].'-'.$archiveId,
                'title' => Arr::get($book, 'title', 'كتاب تقني'),
                'description' => collect(Arr::get($book, 'author_name', []))->take(2)->join('، ') ?: 'مؤلف غير محدد',
                'url' => "https://archive.org/details/{$archiveId}",
                'embed_url' => "https://archive.org/embed/{$archiveId}?ui=embed",
                'image' => $coverId ? "https://covers.openlibrary.org/b/id/{$coverId}-L.jpg" : null,
                'source' => 'Open Library · Internet Archive',
                'meta' => (string) Arr::get($book, 'first_publish_year', 'كتاب'),
                'tag' => Arr::first(Arr::get($book, 'subject', [])) ?? 'Programming',
                'embeddable' => true,
                'embed_id' => $archiveId,
                'free' => true,
                'public_access' => true,
                    ];
                })->values()->all();
        });
    }

    public function articles(string $search): array
    {
        $tag = Str::of($search ?: 'webdev')->lower()->replaceMatches('/[^a-z0-9+#-]/', '')->limit(30, '')->toString() ?: 'webdev';

        return Cache::remember('catalog:articles:'.sha1($tag), now()->addMinutes(15), function () use ($tag): array {
            $articles = Http::withHeaders([
                ...$this->publicHeaders(),
                'Accept' => 'application/vnd.forem.api-v1+json',
            ])->retry(2, 250)
                ->timeout(8)
                ->get('https://dev.to/api/articles', [
                    'tag' => $tag,
                    'per_page' => 12,
                    'top' => 30,
                ])->throw()->json();

            return collect($articles)->map(fn (array $article): array => [
                'id' => (string) $article['id'],
                'title' => $article['title'],
                'description' => $article['description'] ?: 'مقال تقني من مجتمع المطورين.',
                'url' => $article['url'],
                'image' => $article['cover_image'] ?: ($article['social_image'] ?? null),
                'source' => 'DEV · '.Arr::get($article, 'user.name', 'Community'),
                'meta' => ($article['reading_time_minutes'] ?? 1).' دقائق قراءة',
                'tag' => Arr::first($article['tag_list'] ?? []) ?? $tag,
            ])->values()->all();
        });
    }

    public function article(int $id): array
    {
        return Cache::remember("catalog:article:{$id}", now()->addMinutes(30), function () use ($id): array {
            return Http::withHeaders([
                ...$this->publicHeaders(),
                'Accept' => 'application/vnd.forem.api-v1+json',
            ])->retry(2, 250)
                ->timeout(10)
                ->get("https://dev.to/api/articles/{$id}")
                ->throw()
                ->json();
        });
    }

    public function courses(string $search): array
    {
        $search = $search ?: 'technology programming cybersecurity data engineering';
        $apiKey = config('services.youtube.key');

        if (! $apiKey) {
            return $this->curatedCourses($search);
        }

        return Cache::remember('catalog:courses:'.sha1($search), now()->addMinutes(30), function () use ($search, $apiKey): array {
            $payload = Http::retry(2, 250)
                ->timeout(8)
                ->get('https://www.googleapis.com/youtube/v3/search', [
                    'part' => 'snippet',
                    'type' => 'video,playlist',
                    'q' => $search,
                    'relevanceLanguage' => 'ar',
                    'regionCode' => 'EG',
                    'maxResults' => 25,
                    'safeSearch' => 'moderate',
                    'key' => $apiKey,
                ])->throw()->json();

            return collect($payload['items'] ?? [])->map(function (array $item) use ($search): array {
                $videoId = Arr::get($item, 'id.videoId');
                $playlistId = Arr::get($item, 'id.playlistId');
                $type = $playlistId ? 'playlist' : 'video';
                $id = $playlistId ?: $videoId;
                $snippet = $item['snippet'];

                return [
                    'id' => $id,
                    'title' => html_entity_decode($snippet['title']),
                    'description' => html_entity_decode($snippet['description'] ?: 'محتوى تعليمي على YouTube.'),
                    'url' => $type === 'playlist' ? "https://www.youtube.com/playlist?list={$id}" : "https://www.youtube.com/watch?v={$id}",
                    'embed_url' => $type === 'playlist' ? "https://www.youtube-nocookie.com/embed/videoseries?list={$id}" : "https://www.youtube-nocookie.com/embed/{$id}",
                    'image' => Arr::get($snippet, 'thumbnails.medium.url'),
                    'source' => 'YouTube · '.$snippet['channelTitle'],
                    'meta' => $type === 'playlist' ? 'قائمة تشغيل' : 'فيديو',
                    'tag' => $search,
                    'type' => $type,
                ];
            })->filter(fn (array $course) => filled($course['id']))->values()->all();
        });
    }

    private function curatedCourses(string $search): array
    {
        $courses = config('services.youtube.curated_courses', []);

        return collect($courses)
            ->filter(function (array $course) use ($search): bool {
                if ($search === 'technology programming cybersecurity data engineering') return true;
                return Str::contains(Str::lower($course['title'].' '.$course['tag']), Str::lower($search));
            })
            ->values()
            ->all();
    }

    private function publicHeaders(): array
    {
        return [
            'Accept' => 'application/json',
            'User-Agent' => config('app.name').'/1.0 ('.config('app.url').')',
        ];
    }
}
