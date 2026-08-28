<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class PlatformStatusController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'name' => 'Dev Nexus Academy API',
            'status' => 'ok',
        ]);
    }
}
