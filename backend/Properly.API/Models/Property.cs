using System.ComponentModel.DataAnnotations;

namespace Properly.API.Models;

public class Property
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string? Country { get; set; }
    
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    public string? PropertyManagerId { get; set; }
    public ApplicationUser? PropertyManager { get; set; }

    public string? OwnerId { get; set; }
    public ApplicationUser? Owner { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Building> Buildings { get; set; } = new List<Building>();
    public ICollection<CapitalProject> CapitalProjects { get; set; } = new List<CapitalProject>();
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}

public class Building
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public int PropertyId { get; set; }
    public Property Property { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Unit> Units { get; set; } = new List<Unit>();
}

public class Unit
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public int Bedrooms { get; set; }
    public decimal Bathrooms { get; set; }
    public decimal SquareFeet { get; set; }
    public decimal MonthlyRent { get; set; }

    public UnitStatus Status { get; set; } = UnitStatus.Vacant;

    public int BuildingId { get; set; }
    public Building Building { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Lease> Leases { get; set; } = new List<Lease>();
    public ICollection<MaintenanceRequest> MaintenanceRequests { get; set; } = new List<MaintenanceRequest>();
    public UnitSyndication? Syndication { get; set; }
}

public enum UnitStatus
{
    Vacant,
    Occupied,
    UnderMaintenance,
    NoticeGiven
}

public class UnitSyndication
{
    [Key]
    public int Id { get; set; }

    public int UnitId { get; set; }
    public Unit Unit { get; set; } = null!;

    [Required]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public bool PublishToZillow { get; set; }
    public bool PublishToTrulia { get; set; }
    public bool PublishToApartmentsDotCom { get; set; }

    public DateTime? PublishedDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
