$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

if (-not (Test-Path -LiteralPath ".\node_modules")) {
    throw "Frontend dependencies are missing. Run .\setup-windows.ps1 first."
}

$apiPath = Join-Path $PSScriptRoot "laravel-api"
if (-not (Test-Path -LiteralPath (Join-Path $apiPath "vendor\autoload.php"))) {
    throw "Laravel dependencies are missing. Run .\setup-windows.ps1 first."
}

$escapedApiPath = $apiPath.Replace("'", "''")
$apiCommand = "Set-Location -LiteralPath '$escapedApiPath'; php artisan serve --host=127.0.0.1 --port=8000"
$powerShellExecutable = (Get-Process -Id $PID).Path

Start-Process -FilePath $powerShellExecutable -ArgumentList @("-NoExit", "-Command", $apiCommand)

Write-Host "Laravel API is starting at http://127.0.0.1:8000" -ForegroundColor Magenta
Write-Host "Frontend is starting at http://localhost:3000" -ForegroundColor Cyan

npm run dev
