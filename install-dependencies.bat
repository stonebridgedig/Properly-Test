@echo off
echo ====================================
echo   Properly - Install Dependencies
echo ====================================
echo.

cd /d "%~dp0"

echo Installing frontend dependencies...
echo.

if not exist "node_modules" (
    echo No node_modules folder found. Running npm install...
) else (
    echo Existing node_modules found. Reinstalling to ensure vite is present...
    rmdir /s /q node_modules
)

echo.
echo Running npm install...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm install failed
    echo.
    echo Please ensure Node.js is installed:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo.
echo ====================================
echo   Dependencies installed!
echo ====================================
echo.
echo Frontend dependencies are ready.
echo You can now run: run-all.bat
echo.

pause
