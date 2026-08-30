<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\LearningController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:api')->group(function (): void {
    Route::prefix('auth')->middleware('throttle:auth')->group(function (): void {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{course:slug}', [CourseController::class, 'show']);

    Route::prefix('catalog')->group(function (): void {
        Route::get('/books', [CatalogController::class, 'books']);
        Route::get('/courses', [CatalogController::class, 'courses']);
        Route::get('/articles', [CatalogController::class, 'articles']);
        Route::get('/articles/{article}', [CatalogController::class, 'article'])
            ->whereNumber('article');
    });

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/dashboard', [LearningController::class, 'dashboard']);

        Route::post(
            '/courses/{course}/enroll',
            [LearningController::class, 'enroll'],
        );

        Route::get(
            '/courses/{course:slug}/learning',
            [LearningController::class, 'course'],
        );

        Route::get(
            '/lessons/{lesson}',
            [LearningController::class, 'lesson'],
        );

        Route::put(
            '/lessons/{lesson}/progress',
            [LearningController::class, 'updateProgress'],
        );
    });
});
