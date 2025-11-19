using System.ComponentModel.DataAnnotations;

namespace Properly.API.Models;

public class Payment
{
    [Key]
    public int Id { get; set; }

    public int LeaseId { get; set; }
    public Lease Lease { get; set; } = null!;

    public string TenantId { get; set; } = string.Empty;
    public ApplicationUser Tenant { get; set; } = null!;

    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? PaidDate { get; set; }

    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public PaymentMethod PaymentMethod { get; set; }

    public string? StripePaymentIntentId { get; set; }
    public string? TransactionId { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum PaymentStatus
{
    Pending,
    Processing,
    Paid,
    Failed,
    Refunded,
    Overdue
}

public enum PaymentMethod
{
    ACH,
    CreditCard,
    DebitCard,
    Cash,
    Check,
    BankTransfer,
    Other
}

public class SavedPaymentMethod
{
    [Key]
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public PaymentMethod Type { get; set; }

    [MaxLength(4)]
    public string? Last4 { get; set; }

    public string? CardBrand { get; set; }
    public string? BankName { get; set; }

    public string? StripePaymentMethodId { get; set; }

    public bool IsPrimary { get; set; }
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
