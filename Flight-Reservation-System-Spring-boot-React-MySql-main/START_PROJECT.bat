@echo off
SETLOCAL EnableDelayedExpansion

echo ===================================================
echo   BookMyFlight - Clean Startup Script
echo ===================================================

:: 1. KILL EXISTING PROCESSES
echo [1/4] Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8980') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
echo Done clean up.

:: 2. START PAYMENT GATEWAY (ASP.NET)
echo [2/4] Launching Payment Gateway (Port 5000)...
start "Payment Gateway" cmd /c "cd /d "%~dp0PaymentGetway" && dotnet run --urls http://127.0.0.1:5000"

:: 3. START BOOKING BACKEND (JAVA)
echo [3/4] Launching Java Backend (Port 8980)...
:: We use call to prevent the "}" was unexpected error by isolating the context
start "Java Backend" cmd /c "cd /d "%~dp0BookMyFlight_Backend" && .\mvnw.cmd spring-boot:run"

:: 4. START FRONTEND UI (REACT)
echo [4/4] Launching React UI (Port 3000)...
:: If react-scripts is missing, we try to install it first
start "React UI" cmd /c "cd /d "%~dp0BookMyFlight_UI" && if not exist node_modules\react-scripts (echo Installing dependencies... && npm install) && npm start"

echo.
echo ===================================================
echo Services are being launched in separate windows.
echo.
echo Check the new windows for errors.
echo.
echo Frontend: http://127.0.0.1:3000
echo Backend:  http://127.0.0.1:8980
echo Gateway:  http://127.0.0.1:5000
echo ===================================================
pause
