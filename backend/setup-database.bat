@echo off
echo ====================================
echo  Properly API - Database Setup
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

echo Installing EF Core tools...
dotnet tool install --global dotnet-ef

echo.
echo Restoring packages...
dotnet restore

echo.
echo NOTE: Database will be created automatically when you run the API
echo This is using EnsureCreated for development ease.
echo.
echo For production, you should use migrations:
echo   dotnet ef migrations add InitialCreate
echo   dotnet ef database update
echo.
echo ====================================
echo  Setup completed!
echo ====================================
echo.
echo You can now run the API using run-api.bat
echo The database will be created on first run.
echo.

pause
