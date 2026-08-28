$ErrorActionPreference = "Stop"

function Assert-Command {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Name,
        [Parameter(Mandatory = $true)]
        [string] $InstallHint
    )

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "$Name was not found. $InstallHint"
    }
}

Set-Location -LiteralPath $PSScriptRoot

if ($PSScriptRoot -match "\\Desktop(\\|$)") {
    throw "This project is inside Desktop, where Windows blocked Composer writes. Move it to $env:USERPROFILE\Projects\Dev-Nexus-Academy and run this script again."
}

Assert-Command -Name "node" -InstallHint "Install Node.js 22.13 or newer, then open a new terminal."
Assert-Command -Name "npm" -InstallHint "Reinstall Node.js with npm, then open a new terminal."
Assert-Command -Name "php" -InstallHint "Install PHP 8.4 or use Laravel Herd, then open a new terminal."
Assert-Command -Name "composer" -InstallHint "Install Composer, then open a new terminal."

if (-not (Test-Path -LiteralPath ".env.local")) {
    Copy-Item -LiteralPath ".env.example" -Destination ".env.local"
}

Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
npm ci
if ($LASTEXITCODE -ne 0) {
    throw "Frontend dependency installation failed."
}

Write-Host "Preparing Laravel API..." -ForegroundColor Cyan
& "$PSScriptRoot\laravel-api\setup-windows.ps1"

Write-Host "Setup completed successfully." -ForegroundColor Green
Write-Host "Run .\start-windows.ps1 to start the platform."
