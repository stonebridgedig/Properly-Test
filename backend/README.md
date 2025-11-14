# Properly API - ASP.NET Core Backend

A comprehensive property management backend API built with ASP.NET Core 8.0, Entity Framework Core, and SQL Server.

## Features

- **JWT Authentication** with role-based authorization (PropertyManager, Owner, Tenant)
- **Entity Framework Core** with SQL Server database
- **Stripe Integration** for payment processing
- **Azure Blob Storage** for file uploads
- **RESTful API** with Swagger documentation
- **Comprehensive Models** for properties, leases, payments, maintenance, and more

## Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads) (LocalDB, Express, or full version)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [Visual Studio Code](https://code.visualstudio.com/)

## Getting Started

### 1. Clone the Repository

```bash
cd c:\Users\A\Desktop\properly\backend\Properly.API
```

### 2. Update Connection String

Edit `appsettings.json` and update the connection string if needed:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ProperlyDB;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### 3. Install Dependencies

```bash
dotnet restore
```

### 4. Create Database

Run the Entity Framework migrations to create the database:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

If you don't have the EF Core tools installed:

```bash
dotnet tool install --global dotnet-ef
```

### 5. Seed Initial Roles

The application uses three roles: `PropertyManager`, `Owner`, and `Tenant`. You'll need to create these roles manually or add a seed method.

### 6. Run the Application

```bash
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:7001`
- HTTP: `http://localhost:5001`
- Swagger: `https://localhost:7001/swagger`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout

### Properties

- `GET /api/properties` - Get all properties (filtered by user role)
- `GET /api/properties/{id}` - Get property by ID
- `POST /api/properties` - Create new property (PropertyManager only)
- `PUT /api/properties/{id}` - Update property (PropertyManager only)
- `DELETE /api/properties/{id}` - Delete property (PropertyManager only)
- `POST /api/properties/{propertyId}/buildings` - Add building
- `POST /api/properties/{propertyId}/buildings/{buildingId}/units` - Add unit

### Payments

- `GET /api/payments` - Get all payments (filtered by user role)
- `GET /api/payments/{id}` - Get payment by ID
- `POST /api/payments` - Make a payment (Tenant only)
- `GET /api/payments/rent-roll` - Get rent roll data
- `GET /api/payments/saved-methods` - Get saved payment methods
- `POST /api/payments/saved-methods` - Add payment method

### Maintenance

- `GET /api/maintenance` - Get all maintenance requests (filtered by user role)
- `GET /api/maintenance/{id}` - Get maintenance request by ID
- `POST /api/maintenance` - Create maintenance request (Tenant only)
- `PUT /api/maintenance/{id}` - Update maintenance request (PropertyManager only)
- `POST /api/maintenance/{id}/photos` - Upload photo
- `POST /api/maintenance/{id}/updates` - Add update/note

### Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

## Configuration

### JWT Settings

Edit `appsettings.json`:

```json
{
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "ProperlyAPI",
    "Audience": "ProperlyClient",
    "ExpirationMinutes": 1440
  }
}
```

**Important:** Change the `SecretKey` to a secure random string before deploying to production!

### Stripe Integration

Add your Stripe API keys to `appsettings.json`:

```json
{
  "Stripe": {
    "SecretKey": "sk_test_your_stripe_secret_key",
    "PublishableKey": "pk_test_your_stripe_publishable_key"
  }
}
```

Get your keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

### Azure Storage (Optional)

For file uploads, configure Azure Blob Storage:

```json
{
  "AzureStorage": {
    "ConnectionString": "your_azure_storage_connection_string",
    "ContainerName": "properly-documents"
  }
}
```

If not configured, the app will use mock URLs for development.

## Database Models

The API includes the following main entities:

- **ApplicationUser** - User accounts with role-based access
- **Property** - Properties with buildings and units
- **Lease** - Tenant leases with start/end dates
- **Payment** - Rent payments with Stripe integration
- **MaintenanceRequest** - Maintenance requests with photos and updates
- **Vendor** - Service vendors for maintenance
- **CapitalProject** - Capital improvement projects with budgets
- **Transaction** - Financial transactions and accounting
- **Announcement** - Property announcements
- **Message** - Direct messaging between users
- **Notification** - In-app notifications
- **TenantScreening** - Tenant screening data
- **Document** - File storage with folder structure

## Development

### Adding Migrations

After modifying models:

```bash
dotnet ef migrations add YourMigrationName
dotnet ef database update
```

### Running Tests

```bash
dotnet test
```

### Building for Production

```bash
dotnet publish -c Release -o ./publish
```

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

Update `Program.cs` to add more origins if needed.

## Security Considerations

1. **Change JWT Secret** - Use a strong, random secret key
2. **Use HTTPS** - Always use HTTPS in production
3. **Secure API Keys** - Use environment variables or Azure Key Vault for secrets
4. **Input Validation** - DTOs include validation attributes
5. **Authorization** - All endpoints require authentication except login/register
6. **Rate Limiting** - Consider adding rate limiting middleware

## Next Steps

1. Create seed data for development
2. Add more controllers (Leases, Capital Projects, Documents, etc.)
3. Implement background jobs for notifications and reminders
4. Add email service integration
5. Set up CI/CD pipeline
6. Add comprehensive unit and integration tests
7. Configure logging and monitoring

## Connecting Frontend

Update your React app to use this API:

1. Create an API client service
2. Store JWT token in localStorage or httpOnly cookies
3. Include Authorization header: `Bearer {token}`
4. Handle 401 responses by redirecting to login

Example API client:

```typescript
const API_URL = 'https://localhost:7001/api';

export const apiClient = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  },

  async get(endpoint: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
};
```

## Support

For issues or questions, please check the documentation or contact the development team.
