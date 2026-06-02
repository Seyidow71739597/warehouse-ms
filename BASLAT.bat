@echo off
title WYZWOZ Ambar Ulgamy
color 0B

:: Projenin olduğu klasöre odaklan (Flash bellek sürücüsü değişse bile çalışır)
cd /d "%~dp0"

echo ===================================================
echo   WYZWOZ AMBAR SISTEMI BASLATILIYOR...
echo ===================================================
echo.

:: Node.js yüklü mü kontrol et
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo HATA: Node.js bulunamadi! 
    echo Lutfen once Node.js kurulumunu yapin.
    pause
    exit
)

echo Tarayici aciliyor...
timeout /t 3 >nul
start http://localhost:3000

echo Uygulama baslatiliyor (npm run start)...
call npm run start

if %errorlevel% neq 0 (
    echo.
    echo Bir hata olustu! Uygulama baslatilamadi.
    pause
)