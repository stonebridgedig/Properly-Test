using System.ComponentModel.DataAnnotations;

namespace Properly.API.Models;

public class TenantScreening
{
    [Key]
    public int Id { get; set; }

    public string TenantId { get; set; } = string.Empty;
    public ApplicationUser Tenant { get; set; } = null!;

    public int? UnitId { get; set; }
    public Unit? Unit { get; set; }

    public ScreeningStatus OverallStatus { get; set; } = ScreeningStatus.NotStarted;

    // Credit Check
    public ScreeningCheckStatus CreditCheckStatus { get; set; } = ScreeningCheckStatus.NotStarted;
    public int? CreditScore { get; set; }
    public string? CreditRecommendation { get; set; }
    public decimal? TotalDebt { get; set; }
    public string? PaymentHistory { get; set; }

    // Background Check
    public ScreeningCheckStatus BackgroundCheckStatus { get; set; } = ScreeningCheckStatus.NotStarted;
    public string? CriminalHistory { get; set; }
    public string? EvictionHistory { get; set; }

    // Income Verification
    public ScreeningCheckStatus IncomeVerificationStatus { get; set; } = ScreeningCheckStatus.NotStarted;
    public decimal? AnnualIncome { get; set; }
    public string? EmploymentStatus { get; set; }

    // Rental History
    public ScreeningCheckStatus RentalHistoryStatus { get; set; } = ScreeningCheckStatus.NotStarted;
    public string? PreviousLandlordContact { get; set; }
    public string? RentalHistoryNotes { get; set; }

    public DateTime? ApprovedDate { get; set; }
    public DateTime? DeniedDate { get; set; }
    public string? DecisionNotes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum ScreeningStatus
{
    NotStarted,
    InProgress,
    AwaitingDecision,
    Approved,
    Denied
}

public enum ScreeningCheckStatus
{
    NotStarted,
    Pending,
    Completed,
    Verified,
    Error
}
