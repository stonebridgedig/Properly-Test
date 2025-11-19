using System.ComponentModel.DataAnnotations;

namespace Properly.API.Models;

public class CapitalProject
{
    [Key]
    public int Id { get; set; }

    public int PropertyId { get; set; }
    public Property Property { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal EstimatedCost { get; set; }
    public decimal ActualCost { get; set; }

    public int LifespanYears { get; set; }

    public ProjectStatus Status { get; set; } = ProjectStatus.Proposed;

    public int Progress { get; set; } = 0; // 0-100

    public DateTime ProposedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ApprovedDate { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? CompletedDate { get; set; }

    public string? ApprovedById { get; set; }
    public ApplicationUser? ApprovedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<ProjectExpense> Expenses { get; set; } = new List<ProjectExpense>();
    public ICollection<ProjectDocument> Documents { get; set; } = new List<ProjectDocument>();
    public ICollection<ProjectActivityLog> ActivityLog { get; set; } = new List<ProjectActivityLog>();
}

public enum ProjectStatus
{
    Proposed,
    Approved,
    InProgress,
    Completed,
    Cancelled
}

public class ProjectExpense
{
    [Key]
    public int Id { get; set; }

    public int CapitalProjectId { get; set; }
    public CapitalProject CapitalProject { get; set; } = null!;

    [Required]
    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    public string? InvoiceUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ProjectDocument
{
    [Key]
    public int Id { get; set; }

    public int CapitalProjectId { get; set; }
    public CapitalProject CapitalProject { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public DocumentType Type { get; set; }

    [Required]
    public string FileUrl { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}

public enum DocumentType
{
    Contract,
    Invoice,
    Permit,
    Photo,
    Other
}

public class ProjectActivityLog
{
    [Key]
    public int Id { get; set; }

    public int CapitalProjectId { get; set; }
    public CapitalProject CapitalProject { get; set; } = null!;

    [Required]
    public string Activity { get; set; } = string.Empty;

    public string? PerformedById { get; set; }
    public ApplicationUser? PerformedBy { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
