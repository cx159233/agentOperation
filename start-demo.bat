@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ========================================
echo Medical AI Demo Launcher
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found.
  echo Please install Node.js 18 or newer from: https://nodejs.org/
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found. Please reinstall Node.js.
  echo.
  pause
  exit /b 1
)

echo [1/3] Installing dependencies. This may take a few minutes...
if exist package-lock.json (
  call npm ci
) else (
  call npm install
)
if errorlevel 1 (
  echo.
  echo [ERROR] Dependency installation failed.
  echo Please check your network or npm registry settings.
  echo You can also try: npm config set registry https://registry.npmmirror.com
  echo.
  pause
  exit /b 1
)

echo.
echo [2/3] Starting local server...
echo URL: http://127.0.0.1:5173/service-hall
echo.
echo [3/3] Opening browser...
start "" "http://127.0.0.1:5173/service-hall"

echo.
echo Server is running. Close this window or press Ctrl+C to stop.
echo.
call npm run dev

pause
