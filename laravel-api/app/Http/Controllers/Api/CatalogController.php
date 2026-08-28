<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ContentCatalogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;

class CatalogController extends Controller
{
    public function __construct(private readonly ContentCatalogService $catalog) {}

    public function books(Request $request): JsonResponse
    {
        return $this->respond($request, fn (string $search) => $this->catalog->books($search));
    }

    public function articles(Request $request): JsonResponse
    {
        return $this->respond($request, fn (string $search) => $this->catalog->articles($search));
    }

    public function article(int $article): JsonResponse
    {
        try {
            return response()->json(['data' => $this->catalog->article($article)]);
        } catch (ConnectionException|RequestException) {
            return response()->json(['message' => 'تعذر تحميل المقال كاملًا الآن.'], 503);
        }
    }

    public function courses(Request $request): JsonResponse
    {
        return $this->respond($request, fn (string $search) => $this->catalog->courses($search));
    }

    private function respond(Request $request, callable $resolver): JsonResponse
    {
        $data = $request->validate(['search' => ['nullable', 'string', 'max:80']]);

        try {
            return response()->json(['data' => $resolver(trim($data['search'] ?? ''))]);
        } catch (ConnectionException|RequestException) {
            return response()->json([
                'message' => 'مصدر المحتوى غير متاح مؤقتًا. حاول مرة أخرى لاحقًا.',
                'data' => [],
            ], 503);
        }
    }
}
