@echo off
echo ====================================
echo   Properly - Full Stack Startup
echo ====================================
echo.
echo Starting Backend API and Frontend...
echo.

cd /d "%~dp0"

:: Check if node_modules exists
if not exist "node_modules" (
    echo WARNING: node_modules not found!
    echo Running npm install first...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: Failed to install dependencies
        echo Please run: install-dependencies.bat
        pause
        exit /b 1
    )
)

:: Start the backend API in a new window
start "Properly API" cmd /k "cd backend && run-api.bat"

:: Wait a moment for the API to start
timeout /t 3 /nobreak >nul

:: Start the frontend in a new window
start "Properly Frontend" cmd /k "npm run dev"

echo.
echo ====================================
echo Both servers are starting...
echo ====================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  https://localhost:7001/swagger
echo.

:: Wait a few seconds for servers to start
echo Waiting for servers to start...
timeout /t 8 /nobreak >nul

:: Open the frontend in default browser
echo Opening frontend in browser...
start http://localhost:3000

:: Open the backend Swagger in default browser (use http to avoid cert warnings)
echo Opening API documentation in browser...
start http://localhost:5001/swagger

echo.
echo Both sites should now be open in your browser!
echo.
echo Close this window or press any key to continue...
pause >nul
