using System.ComponentModel.DataAnnotations;

namespace Properly.API.Models;

public class MaintenanceRequest
{
    [Key]
    public int Id { get; set; }

    public int UnitId { get; set; }
    public Unit Unit { get; set; } = null!;

    public string TenantId { get; set; } = string.Empty;
    public ApplicationUser Tenant { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    public MaintenancePriority Priority { get; set; } = MaintenancePriority.Medium;
    public MaintenanceStatus Status { get; set; } = MaintenanceStatus.Submitted;

    public string? Category { get; set; }

    public int? AssignedVendorId { get; set; }
    public Vendor? AssignedVendor { get; set; }

    public DateTime SubmittedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ScheduledDate { get; set; }
    public DateTime? CompletedDate { get; set; }

    public decimal? EstimatedCost { get; set; }
    public decimal? ActualCost { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<MaintenancePhoto> Photos { get; set; } = new List<MaintenancePhoto>();
    public ICollection<MaintenanceUpdate> Updates { get; set; } = new List<MaintenanceUpdate>();
}

public enum MaintenancePriority
{
    Low,
    Medium,
    High,
    Emergency
}

public enum MaintenanceStatus
{
    Submitted,
    InProgress,
    Scheduled,
    Completed,
    Cancelled
}

public class MaintenancePhoto
{
    [Key]
    public int Id { get; set; }

    public int MaintenanceRequestId { get; set; }
    public MaintenanceRequest MaintenanceRequest { get; set; } = null!;

    [Required]
    public string PhotoUrl { get; set; } = string.Empty;

    public string? Caption { get; set; }

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}

public class MaintenanceUpdate
{
    [Key]
    public int Id { get; set; }

    public int MaintenanceRequestId { get; set; }
    public MaintenanceRequest MaintenanceRequest { get; set; } = null!;

    public string UpdatedById { get; set; } = string.Empty;
    public ApplicationUser UpdatedBy { get; set; } = null!;

    [Required]
    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
