# Tutoring System Setup Script
# Run this in PowerShell as: .\setup.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Tutoring System - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Backend Setup
Write-Host "[1/6] Setting up Backend..." -ForegroundColor Yellow
Set-Location -Path "D:\Tutoring-System\backend"

Write-Host "Installing Composer dependencies..." -ForegroundColor Gray
composer install --no-interaction

Write-Host "Creating .env file..." -ForegroundColor Gray
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
}

Write-Host "Generating app key..." -ForegroundColor Gray
php artisan key:generate

Write-Host "Running migrations..." -ForegroundColor Gray
php artisan migrate --force

Write-Host "Seeding demo data..." -ForegroundColor Gray
php artisan db:seed --force

Write-Host "[OK] Backend setup complete!" -ForegroundColor Green
Write-Host ""

# Frontend Setup
Write-Host "[2/6] Setting up Frontend..." -ForegroundColor Yellow
Set-Location -Path "D:\Tutoring-System\frontend"

Write-Host "Installing npm dependencies..." -ForegroundColor Gray
npm install

Write-Host "Creating .env.local file..." -ForegroundColor Gray
if (!(Test-Path ".env.local")) {
    "NEXT_PUBLIC_API_URL=http://localhost:8000" | Out-File -FilePath ".env.local" -Encoding utf8
}

Write-Host "[OK] Frontend setup complete!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the servers:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "  cd D:\Tutoring-System\backend" -ForegroundColor White
Write-Host "  php artisan serve" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "  cd D:\Tutoring-System\frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Demo Login:" -ForegroundColor Cyan
Write-Host "  Admin: admin@example.com / password" -ForegroundColor White
Write-Host "  Teacher: teacher@example.com / password" -ForegroundColor White
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend API: http://localhost:8000" -ForegroundColor White
Write-Host ""
