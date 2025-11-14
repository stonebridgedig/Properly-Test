using Properly.API.Models;

namespace Properly.API.Services;

public interface INotificationService
{
    Task CreateNotificationAsync(string userId, string text, NotificationType type, string? link = null);
    Task NotifyMaintenanceRequestAsync(MaintenanceRequest request);
    Task NotifyPaymentReceivedAsync(Payment payment);
    Task NotifyLeaseExpiringAsync(Lease lease, int daysUntilExpiration);
}
