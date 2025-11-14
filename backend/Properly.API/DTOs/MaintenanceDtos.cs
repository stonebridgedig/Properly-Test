using System.ComponentModel.DataAnnotations;
using Properly.API.Models;

namespace Properly.API.DTOs;

public class CreateMaintenanceRequestDto
{
    [Required]
    public int UnitId { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    public MaintenancePriority Priority { get; set; } = MaintenancePriority.Medium;

    public string? Category { get; set; }
}

public class UpdateMaintenanceRequestDto
{
    public MaintenanceStatus Status { get; set; }
    public MaintenancePriority Priority { get; set; }
    public int? AssignedVendorId { get; set; }
    public DateTime? ScheduledDate { get; set; }
    public decimal? EstimatedCost { get; set; }
    public decimal? ActualCost { get; set; }
    public string? Notes { get; set; }
}

public class AddMaintenanceUpdateDto
{
    [Required]
    public string Message { get; set; } = string.Empty;
}
