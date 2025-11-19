using System.ComponentModel.DataAnnotations;

namespace Properly.API.Models;

public class Vendor
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? CompanyName { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    [Phone]
    public string? Phone { get; set; }

    public string? Address { get; set; }

    [MaxLength(100)]
    public string? Specialty { get; set; }

    public decimal? HourlyRate { get; set; }

    public VendorStatus Status { get; set; } = VendorStatus.Active;

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<MaintenanceRequest> MaintenanceRequests { get; set; } = new List<MaintenanceRequest>();
}

public enum VendorStatus
{
    Active,
    Inactive,
    Suspended
}
