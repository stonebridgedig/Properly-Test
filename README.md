# Properly - Property Management Platform

A comprehensive property management application with separate frontend (React + TypeScript) and backend (ASP.NET Core).

## Quick Start

### Option 1: Run Everything (Recommended)

```cmd
run-all.bat
```

This will start both the backend API and frontend development server in separate windows.

### Option 2: Run Individually

**Backend API Only:**
```cmd
cd backend
run-api.bat
```

**Frontend Only:**
```cmd
npm run dev
```

## First Time Setup

### 1. Install Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/)

### 2. Setup Database

```cmd
cd backend
setup-database.bat
```

This creates the database, applies migrations, and seeds test data.

### 3. Install Frontend Dependencies

```cmd
npm install
```

### 4. Run the Application

```cmd
run-all.bat
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: https://localhost:7001/swagger
- **API Base URL**: https://localhost:7001/api

## Default Test Accounts

After database setup, you can login with:

### Property Manager
- Email: `manager@properly.com`
- Password: `Manager123!`

### Property Owner
- Email: `owner@properly.com`
- Password: `Owner123!`

### Tenant
- Email: `tenant@properly.com`
- Password: `Tenant123!`

## Project Structure

```
properly/
├── backend/                    # ASP.NET Core API
│   ├── Properly.API/          # Main API project
│   ├── run-api.bat            # Start backend server
│   ├── setup-database.bat     # Database setup
│   └── README.md              # Backend documentation
├── components/                 # React components
├── contexts/                   # React context providers
├── pages/                      # React pages/routes
├── run-all.bat                # Start both servers
└── package.json               # Frontend dependencies
```

## Features

### For Property Managers
- Dashboard with key metrics
- Property & unit management
- Tenant management & screening
- Rent roll tracking
- Maintenance request management
- Capital project tracking
- Financial overview & reporting
- Vendor management
- Document storage
- Lease templates
- Announcements & messaging

### For Property Owners
- Portfolio overview
- Property performance metrics
- Financial reports (NOI, occupancy)
- Capital project approvals
- Maintenance visibility
- Document access
- Direct messaging with managers

### For Tenants
- Rent payment processing
- Maintenance request submission
- Move-in inspection tool
- Document access
- Announcements & messages
- Payment history & ledger
- AutoPay setup

## Technology Stack

### Frontend
- React 19 with TypeScript
- React Router for routing
- Tailwind CSS for styling
- Recharts for data visualization
- Vite for build tooling

### Backend
- ASP.NET Core 9.0
- Entity Framework Core
- SQL Server
- JWT Authentication
- Stripe for payments
- Azure Blob Storage for files
- Swagger/OpenAPI

## Development

### Frontend Development
```cmd
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```cmd
cd backend/Properly.API
dotnet run                              # Run the API
dotnet ef migrations add MigrationName  # Add migration
dotnet ef database update               # Apply migrations
dotnet test                             # Run tests
```

## Configuration

### Backend Configuration
Edit `backend/Properly.API/appsettings.json`:

- **Database**: Update connection string
- **JWT**: Change secret key for production
- **Stripe**: Add your API keys
- **Azure Storage**: Configure blob storage

### Frontend Configuration
The frontend automatically connects to `https://localhost:7001/api` in development.

For production, update the API URL in your build configuration.

## Troubleshooting

### Backend won't start
- Ensure .NET 9.0 SDK is installed
- Check SQL Server is running
- Run `setup-database.bat` to initialize database

### Frontend won't start
- Run `npm install` to install dependencies
- Check Node.js version (18+ required)
- Delete `node_modules` and reinstall if issues persist

### CORS errors
- Ensure backend is running on `https://localhost:7001`
- Check CORS configuration in `Program.cs`

### Database errors
- Run `setup-database.bat` to reset database
- Check connection string in `appsettings.json`
- Ensure SQL Server LocalDB is installed

## Next Steps

1. Connect the frontend to the backend API
2. Replace mock data with API calls
3. Implement authentication flow
4. Add remaining API endpoints
5. Configure production deployment
6. Add comprehensive testing
7. Set up CI/CD pipeline

## Support

For detailed backend documentation, see [backend/README.md](backend/README.md)

For setup instructions, see [backend/SETUP.md](backend/SETUP.md)
