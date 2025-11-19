@echo off
echo ====================================
echo  Trust ASP.NET Core Dev Certificate
echo ====================================
echo.
echo This will trust the ASP.NET Core HTTPS development certificate
echo so you can use https://localhost:7001 without browser warnings.
echo.
echo Administrator privileges may be required.
echo.
pause

dotnet dev-certs https --clean
dotnet dev-certs https --trust

if %errorlevel% equ 0 (
    echo.
    echo ====================================
    echo  Certificate trusted successfully!
    echo ====================================
    echo.
    echo You can now use HTTPS without warnings.
    echo.
) else (
    echo.
    echo ERROR: Failed to trust certificate
    echo You may need to run as Administrator
    echo.
)

pause
