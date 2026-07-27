$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

Write-Host "========================================"
Write-Host "Medical AI Demo Launcher"
Write-Host "========================================"
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "[ERROR] Node.js was not found. Install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
  Read-Host "Press Enter to exit"
  exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "[ERROR] npm was not found. Please reinstall Node.js." -ForegroundColor Red
  Read-Host "Press Enter to exit"
  exit 1
}

Write-Host "[1/3] Installing dependencies. This may take a few minutes..."
if (Test-Path .\package-lock.json) {
  npm ci
} else {
  npm install
}
if ($LASTEXITCODE -ne 0) {
  Write-Host "[ERROR] Dependency installation failed." -ForegroundColor Red
  Write-Host "Try: npm config set registry https://registry.npmmirror.com"
  Read-Host "Press Enter to exit"
  exit 1
}

$url = "http://127.0.0.1:5173/service-hall"
Write-Host ""
Write-Host "[2/3] Starting local server..."
Write-Host "URL: $url"
Write-Host ""
Write-Host "[3/3] Opening browser..."
Start-Process $url
Write-Host ""
Write-Host "Server is running. Close this window or press Ctrl+C to stop."
Write-Host ""

npm run dev
Read-Host "Press Enter to exit"
