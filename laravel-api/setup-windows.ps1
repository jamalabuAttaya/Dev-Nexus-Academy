$ErrorActionPreference = "Stop"

Push-Location -LiteralPath $PSScriptRoot

try {
    if (-not (Get-Command php -ErrorAction SilentlyContinue)) {
        throw "PHP was not found. Install PHP 8.4 or use Laravel Herd, then open a new terminal."
    }

    if (-not (Get-Command composer -ErrorAction SilentlyContinue)) {
        throw "Composer was not found. Install Composer, then open a new terminal."
    }

    $directories = @(
        "bootstrap\cache",
        "storage\framework\cache\data",
        "storage\framework\sessions",
        "storage\framework\views",
        "storage\app\private",
        "storage\app\public",
        "storage\logs"
    )

    foreach ($directory in $directories) {
        New-Item -ItemType Directory -Force -Path $directory | Out-Null
    }

    if (-not (Test-Path -LiteralPath ".env")) {
        Copy-Item -LiteralPath ".env.example" -Destination ".env"
    }

    if (-not (Test-Path -LiteralPath "database\database.sqlite")) {
        New-Item -ItemType File -Path "database\database.sqlite" | Out-Null
    }

    $env:COMPOSER_MAX_PARALLEL_HTTP = "1"
    $env:COMPOSER_PROCESS_TIMEOUT = "900"

    composer clear-cache
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Composer cache could not be fully cleared. Continuing."
    }

    composer install --prefer-dist --no-dev --no-interaction --optimize-autoloader
    if ($LASTEXITCODE -ne 0) {
        throw "Laravel dependency installation failed. Move the project outside Desktop and allow php.exe in Windows Security."
    }

    $environment = Get-Content -LiteralPath ".env" -Raw
    if ($environment -match "(?m)^APP_KEY=\s*$") {
        php artisan key:generate --ansi
        if ($LASTEXITCODE -ne 0) {
            throw "APP_KEY generation failed."
        }
    }

    php artisan optimize:clear
    if ($LASTEXITCODE -ne 0) {
        throw "Laravel cache cleanup failed."
    }

    php artisan migrate --seed
    if ($LASTEXITCODE -ne 0) {
        throw "Database migration or seeding failed."
    }

    Write-Host "Laravel API is ready." -ForegroundColor Green
}
finally {
    Pop-Location
}
