using Properly.API.Models;

namespace Properly.API.Services;

public interface IPaymentService
{
    Task<string> CreatePaymentIntentAsync(decimal amount, string currency = "usd");
    Task<bool> ProcessPaymentAsync(Payment payment, string paymentMethodId);
    Task<bool> RefundPaymentAsync(string paymentIntentId, decimal? amount = null);
    Task<string> CreateCustomerAsync(string email, string name);
    Task<string> AttachPaymentMethodAsync(string customerId, string paymentMethodId);
}
