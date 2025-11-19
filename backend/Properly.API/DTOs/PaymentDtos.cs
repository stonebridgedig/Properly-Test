using System.ComponentModel.DataAnnotations;
using Properly.API.Models;

namespace Properly.API.DTOs;

public class CreatePaymentDto
{
    [Required]
    public int LeaseId { get; set; }

    [Required]
    [Range(0.01, 1000000)]
    public decimal Amount { get; set; }

    [Required]
    public DateTime DueDate { get; set; }

    [Required]
    public PaymentMethod PaymentMethod { get; set; }

    [Required]
    public string PaymentMethodId { get; set; } = string.Empty; // Stripe payment method ID
}

public class AddPaymentMethodDto
{
    [Required]
    public PaymentMethod Type { get; set; }

    public string? Last4 { get; set; }
    public string? CardBrand { get; set; }
    public string? BankName { get; set; }
    public string? StripePaymentMethodId { get; set; }
    public bool IsPrimary { get; set; }
}
