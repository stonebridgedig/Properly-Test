# Setup Instructions for Properly API

## Quick Start

1. **Install .NET 9.0 SDK**
   - Download from: https://dotnet.microsoft.com/download/dotnet/9.0

2. **Navigate to the API directory**
   ```cmd
   cd c:\Users\A\Desktop\properly\backend\Properly.API
   ```

3. **Restore packages**
   ```cmd
   dotnet restore
   ```

4. **Install Entity Framework Tools** (if not already installed)
   ```cmd
   dotnet tool install --global dotnet-ef
   ```

5. **Run the application** (migrations and seeding will happen automatically)
   ```cmd
   dotnet run
   ```

6. **Access the API**
   - Swagger UI: https://localhost:7001/swagger
   - API Base URL: https://localhost:7001/api

## Default Test Accounts

After seeding, you can login with these accounts:

**Property Manager:**
- Email: manager@properly.com
- Password: Manager123!

**Owner:**
- Email: owner@properly.com
- Password: Owner123!

**Tenant:**
- Email: tenant@properly.com
- Password: Tenant123!

## Testing the API

1. **Get a JWT Token**
   - POST to `/api/auth/login` with email and password
   - Copy the `token` from the response

2. **Authorize in Swagger**
   - Click the "Authorize" button at the top
   - Enter: `Bearer {your-token-here}`
   - Click "Authorize"

3. **Test Endpoints**
   - All endpoints are now authorized
   - Try GET `/api/properties` to see properties
   - Try GET `/api/notifications` to see notifications

## Manual Database Setup (if automatic migration fails)

```cmd
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Troubleshooting

**SQL Server Connection Issues:**
- Make sure SQL Server LocalDB is installed
- Or change the connection string in `appsettings.json` to point to your SQL Server instance

**Port Already in Use:**
- Change the port in `Properties/launchSettings.json`

**CORS Errors:**
- Update the CORS origins in `Program.cs` if your frontend runs on a different port
