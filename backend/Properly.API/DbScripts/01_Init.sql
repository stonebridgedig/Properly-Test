
-- Create Tables

CREATE TABLE Owners (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20) NOT NULL
);

CREATE TABLE Properties (
    Name NVARCHAR(100) PRIMARY KEY, -- Using Name as ID to match frontend, though int/guid is better usually. Keeping it simple for now.
    Address NVARCHAR(200) NOT NULL,
    OwnerId NVARCHAR(50) NOT NULL, -- Changed to ID reference
    Latitude FLOAT,
    Longitude FLOAT,
    FOREIGN KEY (OwnerId) REFERENCES Owners(Id)
);

CREATE TABLE Buildings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PropertyName NVARCHAR(100) NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    FOREIGN KEY (PropertyName) REFERENCES Properties(Name)
);

CREATE TABLE Units (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    BuildingId INT NOT NULL,
    Name NVARCHAR(50) NOT NULL,
    Status NVARCHAR(20) NOT NULL, -- 'Occupied', 'Vacant'
    Rent DECIMAL(18, 2) NOT NULL,
    Bedrooms INT NOT NULL,
    Bathrooms FLOAT NOT NULL,
    FOREIGN KEY (BuildingId) REFERENCES Buildings(Id)
);

CREATE TABLE Tenants (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20) NOT NULL,
    UnitId INT NOT NULL,
    LeaseEndDate DATETIME2,
    LeaseType NVARCHAR(20), -- 'Fixed', 'Month-to-Month'
    Status NVARCHAR(20), -- 'Active', 'Past', 'Future', 'Pending'
    RentStatus NVARCHAR(20), -- 'Paid', 'Upcoming', 'Overdue', 'N/A'
    FOREIGN KEY (UnitId) REFERENCES Units(Id)
);

CREATE TABLE Vendors (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Specialty NVARCHAR(50) NOT NULL,
    ContactName NVARCHAR(100),
    Phone NVARCHAR(20),
    Email NVARCHAR(100),
    Rating INT,
    Status NVARCHAR(20), -- 'Active', 'Inactive', 'Preferred'
    InsuranceExpiry DATETIME2,
    LicenseNumber NVARCHAR(50),
    TaxId NVARCHAR(50)
);

CREATE TABLE MaintenanceRequests (
    Id NVARCHAR(50) PRIMARY KEY,
    UnitId INT NOT NULL,
    TenantId NVARCHAR(50) NOT NULL,
    Issue NVARCHAR(200) NOT NULL,
    Details NVARCHAR(MAX),
    Priority NVARCHAR(20), -- 'Emergency', 'High', 'Medium', 'Low'
    Status NVARCHAR(20), -- 'New', 'In Progress', 'Pending Vendor', 'Completed'
    SubmittedDate DATETIME2 NOT NULL,
    AssignedVendorId NVARCHAR(50),
    ImageUrl NVARCHAR(MAX),
    FOREIGN KEY (UnitId) REFERENCES Units(Id),
    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (AssignedVendorId) REFERENCES Vendors(Id)
);

CREATE TABLE Announcements (
    Id NVARCHAR(50) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    IsPinned BIT NOT NULL DEFAULT 0,
    Status NVARCHAR(20), -- 'Published', 'Draft'
    PublishedDate DATETIME2,
    TargetAudience NVARCHAR(20) -- 'All', 'Tenants', 'Owners'
);

-- Many-to-Many for Announcement Target Properties
CREATE TABLE AnnouncementProperties (
    AnnouncementId NVARCHAR(50) NOT NULL,
    PropertyName NVARCHAR(100) NOT NULL,
    PRIMARY KEY (AnnouncementId, PropertyName),
    FOREIGN KEY (AnnouncementId) REFERENCES Announcements(Id),
    FOREIGN KEY (PropertyName) REFERENCES Properties(Name)
);

CREATE TABLE Conversations (
    Id NVARCHAR(50) PRIMARY KEY,
    ParticipantId NVARCHAR(50) NOT NULL, -- Tenant or Owner ID
    ParticipantType NVARCHAR(20) NOT NULL, -- 'Tenant', 'Owner'
    PropertyInfo NVARCHAR(100),
    LastMessage NVARCHAR(MAX),
    LastMessageTimestamp DATETIME2,
    UnreadCount INT DEFAULT 0,
    ContextId NVARCHAR(50),
    ContextType NVARCHAR(20)
);

CREATE TABLE Messages (
    Id NVARCHAR(50) PRIMARY KEY,
    ConversationId NVARCHAR(50) NOT NULL,
    Sender NVARCHAR(20) NOT NULL, -- 'manager', 'participant'
    Text NVARCHAR(MAX),
    Timestamp DATETIME2 NOT NULL,
    FOREIGN KEY (ConversationId) REFERENCES Conversations(Id)
);

CREATE TABLE Documents (
    Id NVARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    PropertyName NVARCHAR(100), -- Can be null for global docs or 'All Properties' logic handled in app
    Path NVARCHAR(MAX),
    UnitId INT,
    Size NVARCHAR(20),
    UploadDate DATETIME2 NOT NULL,
    VendorId NVARCHAR(50),
    FOREIGN KEY (PropertyName) REFERENCES Properties(Name),
    FOREIGN KEY (UnitId) REFERENCES Units(Id),
    FOREIGN KEY (VendorId) REFERENCES Vendors(Id)
);

CREATE TABLE Transactions (
    Id NVARCHAR(50) PRIMARY KEY,
    Date DATETIME2 NOT NULL,
    Description NVARCHAR(200),
    PropertyName NVARCHAR(100),
    OwnerId NVARCHAR(50),
    Category NVARCHAR(20), -- 'Income', 'Expense'
    Type NVARCHAR(50), -- 'Rent', 'Late Fee', etc.
    Amount DECIMAL(18, 2) NOT NULL,
    FOREIGN KEY (PropertyName) REFERENCES Properties(Name),
    FOREIGN KEY (OwnerId) REFERENCES Owners(Id)
);

CREATE TABLE CapitalProjects (
    Name NVARCHAR(100) PRIMARY KEY, -- Using Name as ID per frontend
    Description NVARCHAR(MAX),
    PropertyName NVARCHAR(100) NOT NULL,
    Cost DECIMAL(18, 2),
    ActualCost DECIMAL(18, 2),
    Status NVARCHAR(20), -- 'Proposed', 'Approved', 'In Progress', 'Completed'
    Lifespan INT,
    Progress INT,
    DateProposed DATETIME2,
    FOREIGN KEY (PropertyName) REFERENCES Properties(Name)
);

CREATE TABLE ExpenseLogs (
    Id NVARCHAR(50) PRIMARY KEY,
    ProjectName NVARCHAR(100) NOT NULL,
    Date DATETIME2,
    Description NVARCHAR(200),
    Amount DECIMAL(18, 2),
    FOREIGN KEY (ProjectName) REFERENCES CapitalProjects(Name)
);

-- Seed Data (Basic)
INSERT INTO Owners (Id, Name, Email, Phone) VALUES 
('o001', 'Prime Properties LLC', 'contact@primeprop.com', '555-0201'),
('o002', 'Greenleaf Investments', 'invest@greenleaf.com', '555-0202');

INSERT INTO Properties (Name, Address, OwnerId, Latitude, Longitude) VALUES
('Oakwood Lofts', '456 Oak Ave, Anytown, USA', 'o001', 41.881832, -87.623177),
('Sunset Villas', '789 Palm Dr, Sunville, USA', 'o002', 25.761681, -80.191788),
('The Grand Apartments', '123 Main St, Anytown, USA', 'o002', 41.902237, -87.649696);
