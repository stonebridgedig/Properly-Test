namespace Properly.API.Models
{
    public class Property
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string OwnerId { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public List<Building> Buildings { get; set; } = new List<Building>();
    }

    public class Building
    {
        public int Id { get; set; }
        public string PropertyName { get; set; }
        public string Name { get; set; }
        public List<Unit> Units { get; set; } = new List<Unit>();
    }

    public class Unit
    {
        public int Id { get; set; }
        public int BuildingId { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public decimal Rent { get; set; }
        public int Bedrooms { get; set; }
        public double Bathrooms { get; set; }
        public List<Tenant> Tenants { get; set; } = new List<Tenant>();
    }

    public class Tenant
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int UnitId { get; set; }
        public DateTime? LeaseEndDate { get; set; }
        public string LeaseType { get; set; }
        public string Status { get; set; }
        public string RentStatus { get; set; }
        
        // Additional properties for display
        public string PropertyName { get; set; }
        public string UnitName { get; set; }
    }
}
