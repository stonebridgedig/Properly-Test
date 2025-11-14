using System.ComponentModel.DataAnnotations;

namespace Properly.API.Models;

public class Lease
{
    [Key]
    public int Id { get; set; }

    public int UnitId { get; set; }
    public Unit Unit { get; set; } = null!;

    public string TenantId { get; set; } = string.Empty;
    public ApplicationUser Tenant { get; set; } = null!;

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public decimal MonthlyRent { get; set; }
    public decimal SecurityDeposit { get; set; }

    public LeaseStatus Status { get; set; } = LeaseStatus.Active;

    public string? LeaseDocumentUrl { get; set; }
    public bool IsSigned { get; set; }
    public DateTime? SignedDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<LeaseTenant> AdditionalTenants { get; set; } = new List<LeaseTenant>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}

public enum LeaseStatus
{
    Pending,
    Active,
    Expired,
    Terminated,
    NoticeGiven
}

public class LeaseTenant
{
    [Key]
    public int Id { get; set; }

    public int LeaseId { get; set; }
    public Lease Lease { get; set; } = null!;

    public string TenantId { get; set; } = string.Empty;
    public ApplicationUser Tenant { get; set; } = null!;

    public decimal RentPortion { get; set; }
}

public class LeaseTemplate
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public bool IsDefault { get; set; }

    public string CreatedById { get; set; } = string.Empty;
    public ApplicationUser CreatedBy { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
