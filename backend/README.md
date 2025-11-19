# Properly Backend

ASP.NET Core Web API backend for the Properly Property Management App.

## Technologies
- .NET 9.0
- ASP.NET Core Web API
- Dapper (ORM)
- Microsoft SQL Server (LocalDB)

## Setup

1. **Prerequisites**:
   - .NET SDK 9.0
   - SQL Server LocalDB (usually installed with Visual Studio or .NET SDK)

2. **Run the Application**:
   ```bash
   cd Properly.API
   dotnet run
   ```

3. **Database**:
   The application will automatically create the database `ProperlyDb_v2` and seed it with initial data on the first run.

## API Documentation
Once running, visit `http://localhost:5255/swagger` to view the Swagger UI.
