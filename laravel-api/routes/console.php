<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('academy:status', function (): void {
    $this->info('Dev Nexus Academy API is ready.');
})->purpose('Display the platform API status');
