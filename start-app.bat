@echo off
echo Starting Properly App...

:: Start Backend
start "Properly Backend" cmd /k "cd backend/Properly.API && dotnet run"

:: Check for node_modules
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

:: Start Frontend
start "Properly Frontend" cmd /k "npm run dev"

echo Waiting for services to start...
timeout /t 5 /nobreak >nul

:: Open Browser
start http://localhost:3000

echo App started! 
echo Backend: http://localhost:5255
echo Frontend: http://localhost:3000
pause
