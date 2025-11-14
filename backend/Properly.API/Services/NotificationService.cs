using Microsoft.EntityFrameworkCore;
using Properly.API.Data;
using Properly.API.Models;

namespace Properly.API.Services;

public class NotificationService : INotificationService
{
    private readonly ApplicationDbContext _context;

    public NotificationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task CreateNotificationAsync(string userId, string text, NotificationType type, string? link = null)
    {
        var notification = new Notification
        {
            UserId = userId,
            Text = text,
            Type = type,
            Link = link,
            IsRead = false,
            Timestamp = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
    }

    public async Task NotifyMaintenanceRequestAsync(MaintenanceRequest request)
    {
        var unit = await _context.Units
            .Include(u => u.Building)
            .ThenInclude(b => b.Property)
            .FirstOrDefaultAsync(u => u.Id == request.UnitId);

        if (unit?.Building?.Property?.PropertyManagerId != null)
        {
            await CreateNotificationAsync(
                unit.Building.Property.PropertyManagerId,
                $"New maintenance request: {request.Title}",
                NotificationType.Maintenance,
                $"/manager/maintenance/{request.Id}"
            );
        }
    }

    public async Task NotifyPaymentReceivedAsync(Payment payment)
    {
        var lease = await _context.Leases
            .Include(l => l.Unit)
            .ThenInclude(u => u.Building)
            .ThenInclude(b => b.Property)
            .FirstOrDefaultAsync(l => l.Id == payment.LeaseId);

        if (lease?.Unit?.Building?.Property?.PropertyManagerId != null)
        {
            await CreateNotificationAsync(
                lease.Unit.Building.Property.PropertyManagerId,
                $"Payment received: ${payment.Amount:N2}",
                NotificationType.Financial,
                $"/manager/rent-roll"
            );
        }

        if (lease?.Unit?.Building?.Property?.OwnerId != null)
        {
            await CreateNotificationAsync(
                lease.Unit.Building.Property.OwnerId,
                $"Rent payment received: ${payment.Amount:N2} for {lease.Unit.Building.Property.Name}",
                NotificationType.Financial,
                $"/owner/financial-overview"
            );
        }
    }

    public async Task NotifyLeaseExpiringAsync(Lease lease, int daysUntilExpiration)
    {
        var unit = await _context.Units
            .Include(u => u.Building)
            .ThenInclude(b => b.Property)
            .FirstOrDefaultAsync(u => u.Id == lease.UnitId);

        if (unit?.Building?.Property?.PropertyManagerId != null)
        {
            await CreateNotificationAsync(
                unit.Building.Property.PropertyManagerId,
                $"Lease expiring in {daysUntilExpiration} days: {unit.Building.Property.Name} - {unit.Name}",
                NotificationType.Lease,
                $"/manager/tenants"
            );
        }

        await CreateNotificationAsync(
            lease.TenantId,
            $"Your lease expires in {daysUntilExpiration} days",
            NotificationType.Lease,
            $"/tenant/settings"
        );
    }
}
