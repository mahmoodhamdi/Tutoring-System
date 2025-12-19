# Start Backend Server
Write-Host "Starting Tutoring System Backend..." -ForegroundColor Cyan
Set-Location -Path "D:\Tutoring-System\backend"
php artisan serve --host=127.0.0.1 --port=8000
