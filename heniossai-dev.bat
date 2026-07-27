@echo off
title HeniossAI Development Environment
setlocal enabledelayedexpansion

REM ============================================
REM  HeniossAI Development Launcher
REM  Supports two modes:
REM    Web     - Backend (port 4096) + Vite dev server (port 4444)
REM    Desktop - Electron-vite dev (manages its own backend)
REM
REM  Usage:
REM    heniossai-dev.bat          - Interactive menu
REM    heniossai-dev.bat web      - Launch Web environment
REM    heniossai-dev.bat desktop  - Launch Desktop (Electron) environment
REM ============================================

set "PROJECT_ROOT=%~dp0"
if "%PROJECT_ROOT:~-1%"=="\" set "PROJECT_ROOT=%PROJECT_ROOT:~0,-1%"
cd /d "%PROJECT_ROOT%" || (
    echo [FAIL] Could not change to project root: %PROJECT_ROOT%
    pause
    exit /b 1
)

REM ---- Parse mode argument ----
set "MODE=%~1"
if not defined MODE (
    echo.
    echo ============================================
    echo    HeniossAI Development Environment
    echo    Project: OpenCode + Presentation Layer
    echo ============================================
    echo.
    echo  Select launch mode:
    echo    1. Web     - Backend + Vite dev server (browser)
    echo    2. Desktop - Electron app development
    echo.
    set /p "MODE=Enter choice (1 or 2): "
    if "!MODE!"=="1" set "MODE=web"
    if "!MODE!"=="2" set "MODE=desktop"
)

if /i "%MODE%"=="web" goto :LAUNCH_WEB
if /i "%MODE%"=="desktop" goto :LAUNCH_DESKTOP
echo [FAIL] Unknown mode: %MODE%. Use "web" or "desktop".
pause
exit /b 1

REM ============================================
REM  WEB MODE
REM ============================================
:LAUNCH_WEB
echo.
echo ============================================
echo    Launching Web Environment
echo ============================================
echo.

REM ---- Clear auth env vars ----
set "OPENCODE_SERVER_PASSWORD="
set "OPENCODE_SERVER_USERNAME="

REM ---- Prerequisite check: Bun ----
where bun.exe >nul 2>nul
if !ERRORLEVEL! neq 0 (
    echo [FAIL] Bun is not installed or not in PATH.
    echo   Install Bun from: https://bun.sh
    pause
    exit /b 1
)

for /f "delims=" %%v in ('bun --version') do set "BUN_VER=%%v"
echo [OK] Bun version %BUN_VER%

REM ---- Prerequisite check: node_modules ----
if not exist "node_modules\" (
    echo [..] node_modules not found. Running bun install...
    call bun install
    if !ERRORLEVEL! neq 0 (
        echo [FAIL] bun install failed.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed.
) else (
    echo [OK] Dependencies found.
)

echo.

REM ---- Check port 4096 ----
echo [..] Checking port 4096 availability...
powershell -NoProfile -Command "$t=New-Object System.Net.Sockets.TcpClient;$r=$t.BeginConnect('127.0.0.1',4096,$null,$null);if($r.AsyncWaitHandle.WaitOne(500,$true)){$t.EndConnect($r);$t.Close();exit 1}else{$t.Close();exit 0}"
if !ERRORLEVEL! equ 1 (
    echo [WARN] Port 4096 is in use. Stopping the process holding it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4096 " ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>nul
    )
    timeout /t 2 /nobreak >nul
)

REM ---- Start backend ----
echo [..] Starting backend server (port 4096)...
start "HeniossAI Backend" /B cmd /c "set OPENCODE_SERVER_PASSWORD=& set OPENCODE_SERVER_USERNAME=& bun run --cwd packages\opencode --conditions=browser src\index.ts serve --port 4096"

REM ---- Wait for backend ----
echo [..] Waiting for backend to be ready...
set "READY_TIMEOUT=45"
set "READY_COUNT=0"

:WAIT_READY_WEB
timeout /t 1 /nobreak >nul
set /a "READY_COUNT+=1"
powershell -NoProfile -Command "$t=New-Object System.Net.Sockets.TcpClient;$r=$t.BeginConnect('127.0.0.1',4096,$null,$null);$w=$r.AsyncWaitHandle.WaitOne(2000,$true);$t.Close();if($w){exit 0}else{exit 1}" >nul 2>nul
if !ERRORLEVEL! equ 0 (
    echo [OK] Backend is ready.
    goto BACKEND_READY_WEB
)
set /a "MOD=!READY_COUNT! %% 5"
if "!MOD!"=="0" echo [..] Still waiting for backend (attempt !READY_COUNT!/%READY_TIMEOUT%)...
if !READY_COUNT! geq %READY_TIMEOUT% (
    echo [FAIL] Backend did not become ready within %READY_TIMEOUT% seconds.
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4096 " ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>nul
    )
    pause
    exit /b 1
)
goto WAIT_READY_WEB

:BACKEND_READY_WEB
echo.

REM ---- Check port 4444 ----
echo [..] Checking port 4444 availability...
powershell -NoProfile -Command "$t=New-Object System.Net.Sockets.TcpClient;$r=$t.BeginConnect('127.0.0.1',4444,$null,$null);if($r.AsyncWaitHandle.WaitOne(500,$true)){$t.EndConnect($r);$t.Close();exit 1}else{$t.Close();exit 0}"
if !ERRORLEVEL! equ 1 (
    echo [WARN] Port 4444 is in use. Stopping stale Vite process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4444 " ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>nul
    )
    timeout /t 1 /nobreak >nul
)

REM ---- Start frontend ----
echo [..] Starting frontend dev server (port 4444)...
echo.
echo  Open http://localhost:4444 in your browser.
echo  Press Ctrl+C in this window to stop all servers.
echo.
start "" "http://localhost:4444"
call bun --cwd packages\app dev -- --port 4444

REM ---- Cleanup ----
echo.
echo [..] Stopping backend server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4096 " ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>nul
)
echo [OK] All servers stopped.
echo.
pause
exit /b 0

REM ============================================
REM  DESKTOP (ELECTRON) MODE
REM ============================================
:LAUNCH_DESKTOP
echo.
echo ============================================
echo    Launching Desktop (Electron) Environment
echo ============================================
echo.

REM ---- Clear auth env vars ----
set "OPENCODE_SERVER_PASSWORD="
set "OPENCODE_SERVER_USERNAME="

REM ---- Prerequisite check: Bun ----
where bun.exe >nul 2>nul
if !ERRORLEVEL! neq 0 (
    echo [FAIL] Bun is not installed or not in PATH.
    echo   Install Bun from: https://bun.sh
    pause
    exit /b 1
)

for /f "delims=" %%v in ('bun --version') do set "BUN_VER=%%v"
echo [OK] Bun version %BUN_VER%

REM ---- Prerequisite check: node_modules ----
if not exist "node_modules\" (
    echo [..] node_modules not found. Running bun install...
    call bun install
    if !ERRORLEVEL! neq 0 (
        echo [FAIL] bun install failed.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed.
) else (
    echo [OK] Dependencies found.
)

echo.

REM ---- Prebuild step: build opencode node server ----
echo [..] Building opencode node server (required by Electron backend)...
set "OPENCODE_CHANNEL=dev"
bun --cwd packages\opencode script\build-node.ts
if !ERRORLEVEL! neq 0 (
    echo [FAIL] Failed to build opencode node server.
    pause
    exit /b 1
)
echo [OK] opencode node server built.

echo.
echo [..] Starting Electron development environment...
echo.
echo  The Electron app window will open once electron-vite finishes building.
echo  Press Ctrl+C in this window to stop.
echo.

REM ---- Launch electron-vite dev ----
set "OPENCODE_CHANNEL=dev"
call bun --cwd packages\desktop dev
if !ERRORLEVEL! neq 0 (
    echo.
    echo [FAIL] Electron dev server exited with an error.
    pause
    exit /b 1
)

echo [OK] Electron dev server stopped.
echo.
pause
exit /b 0
