using System.ComponentModel.DataAnnotations;

namespace Properly.API.Models;

public class Transaction
{
    [Key]
    public int Id { get; set; }

    public int PropertyId { get; set; }
    public Property Property { get; set; } = null!;

    [Required]
    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    public TransactionCategory Category { get; set; }

    [MaxLength(100)]
    public string? Type { get; set; }

    public int? AccountId { get; set; }
    public Account? Account { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public enum TransactionCategory
{
    Income,
    Expense
}

public class Account
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public AccountType Type { get; set; }

    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}

public enum AccountType
{
    Asset,
    Liability,
    Equity,
    Revenue,
    Expense
}
