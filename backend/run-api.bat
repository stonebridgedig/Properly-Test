@echo off
echo ====================================
echo    Properly API - Starting Server
echo ====================================
echo.

cd /d "%~dp0Properly.API"

echo Checking for .NET SDK...
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: .NET SDK is not installed or not in PATH
    echo Please install .NET 9.0 SDK from:
    echo https://dotnet.microsoft.com/download/dotnet/9.0
    echo.
    pause
    exit /b 1
)

echo .NET SDK found!
echo.

echo Restoring NuGet packages...
dotnet restore
if %errorlevel% neq 0 (
    echo ERROR: Failed to restore packages
    pause
    exit /b 1
)

echo.
echo Installing EF Core tools (if not already installed)...
dotnet tool install --global dotnet-ef >nul 2>&1

echo.
echo Starting Properly API...
echo API will be available at:
echo   - https://localhost:7001/swagger
echo   - http://localhost:5001/swagger
echo.
echo Press Ctrl+C to stop the server
echo.

dotnet run

pause
