using Stripe;
using Properly.API.Models;

namespace Properly.API.Services;

public class PaymentService : IPaymentService
{
    private readonly IConfiguration _configuration;

    public PaymentService(IConfiguration configuration)
    {
        _configuration = configuration;
        var stripeSecretKey = _configuration["Stripe:SecretKey"];
        
        if (!string.IsNullOrEmpty(stripeSecretKey) && !stripeSecretKey.Contains("your_stripe"))
        {
            StripeConfiguration.ApiKey = stripeSecretKey;
        }
    }

    public async Task<string> CreatePaymentIntentAsync(decimal amount, string currency = "usd")
    {
        if (StripeConfiguration.ApiKey == null)
        {
            // Mock implementation for development
            return $"pi_mock_{Guid.NewGuid()}";
        }

        var options = new PaymentIntentCreateOptions
        {
            Amount = (long)(amount * 100), // Convert to cents
            Currency = currency,
            PaymentMethodTypes = new List<string> { "card" }
        };

        var service = new PaymentIntentService();
        var paymentIntent = await service.CreateAsync(options);
        return paymentIntent.Id;
    }

    public async Task<bool> ProcessPaymentAsync(Models.Payment payment, string paymentMethodId)
    {
        if (StripeConfiguration.ApiKey == null)
        {
            // Mock success for development
            payment.Status = PaymentStatus.Paid;
            payment.PaidDate = DateTime.UtcNow;
            payment.StripePaymentIntentId = $"pi_mock_{Guid.NewGuid()}";
            return true;
        }

        try
        {
            var paymentIntentId = await CreatePaymentIntentAsync(payment.Amount);

            var options = new PaymentIntentConfirmOptions
            {
                PaymentMethod = paymentMethodId
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.ConfirmAsync(paymentIntentId, options);

            if (paymentIntent.Status == "succeeded")
            {
                payment.Status = PaymentStatus.Paid;
                payment.PaidDate = DateTime.UtcNow;
                payment.StripePaymentIntentId = paymentIntent.Id;
                return true;
            }

            payment.Status = PaymentStatus.Failed;
            return false;
        }
        catch
        {
            payment.Status = PaymentStatus.Failed;
            return false;
        }
    }

    public async Task<bool> RefundPaymentAsync(string paymentIntentId, decimal? amount = null)
    {
        if (StripeConfiguration.ApiKey == null)
        {
            return true; // Mock success
        }

        try
        {
            var options = new RefundCreateOptions
            {
                PaymentIntent = paymentIntentId
            };

            if (amount.HasValue)
            {
                options.Amount = (long)(amount.Value * 100);
            }

            var service = new RefundService();
            await service.CreateAsync(options);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<string> CreateCustomerAsync(string email, string name)
    {
        if (StripeConfiguration.ApiKey == null)
        {
            return $"cus_mock_{Guid.NewGuid()}";
        }

        var options = new CustomerCreateOptions
        {
            Email = email,
            Name = name
        };

        var service = new CustomerService();
        var customer = await service.CreateAsync(options);
        return customer.Id;
    }

    public async Task<string> AttachPaymentMethodAsync(string customerId, string paymentMethodId)
    {
        if (StripeConfiguration.ApiKey == null)
        {
            return paymentMethodId;
        }

        var options = new PaymentMethodAttachOptions
        {
            Customer = customerId
        };

        var service = new PaymentMethodService();
        await service.AttachAsync(paymentMethodId, options);
        return paymentMethodId;
    }
}
