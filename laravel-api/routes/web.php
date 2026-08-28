<?php

use App\Http\Controllers\PlatformStatusController;
use Illuminate\Support\Facades\Route;

Route::get('/', PlatformStatusController::class);
