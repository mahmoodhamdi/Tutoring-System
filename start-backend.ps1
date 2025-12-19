# Start Backend Server
Write-Host "Starting Tutoring System Backend on port 8001..." -ForegroundColor Cyan
Set-Location -Path "D:\Tutoring-System\backend"
php artisan serve --host=127.0.0.1 --port=8001
