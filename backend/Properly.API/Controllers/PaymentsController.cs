using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Properly.API.Data;
using Properly.API.DTOs;
using Properly.API.Models;
using Properly.API.Services;

namespace Properly.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPaymentService _paymentService;
    private readonly INotificationService _notificationService;

    public PaymentsController(
        ApplicationDbContext context,
        IPaymentService paymentService,
        INotificationService notificationService)
    {
        _context = context;
        _paymentService = paymentService;
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        IQueryable<Payment> query = _context.Payments
            .Include(p => p.Lease)
                .ThenInclude(l => l.Unit)
                    .ThenInclude(u => u.Building)
                        .ThenInclude(b => b.Property);

        if (userRole == "Tenant")
        {
            query = query.Where(p => p.TenantId == userId);
        }
        else if (userRole == "Owner")
        {
            query = query.Where(p => p.Lease.Unit.Building.Property.OwnerId == userId);
        }
        else if (userRole == "PropertyManager")
        {
            query = query.Where(p => p.Lease.Unit.Building.Property.PropertyManagerId == userId);
        }

        return await query.OrderByDescending(p => p.DueDate).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Payment>> GetPayment(int id)
    {
        var payment = await _context.Payments
            .Include(p => p.Lease)
                .ThenInclude(l => l.Unit)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (payment == null)
        {
            return NotFound();
        }

        return payment;
    }

    [Authorize(Roles = "Tenant")]
    [HttpPost]
    public async Task<ActionResult<Payment>> MakePayment([FromBody] CreatePaymentDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        var lease = await _context.Leases.FindAsync(dto.LeaseId);

        if (lease == null || lease.TenantId != userId)
        {
            return BadRequest("Invalid lease");
        }

        var payment = new Payment
        {
            LeaseId = dto.LeaseId,
            TenantId = userId!,
            Amount = dto.Amount,
            DueDate = dto.DueDate,
            PaymentMethod = dto.PaymentMethod,
            Status = PaymentStatus.Processing
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        // Process payment through Stripe
        var success = await _paymentService.ProcessPaymentAsync(payment, dto.PaymentMethodId);

        if (success)
        {
            payment.Status = PaymentStatus.Paid;
            payment.PaidDate = DateTime.UtcNow;
            await _notificationService.NotifyPaymentReceivedAsync(payment);
        }
        else
        {
            payment.Status = PaymentStatus.Failed;
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, payment);
    }

    [HttpGet("rent-roll")]
    public async Task<ActionResult<IEnumerable<object>>> GetRentRoll()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        IQueryable<Lease> leasesQuery = _context.Leases
            .Include(l => l.Unit)
                .ThenInclude(u => u.Building)
                    .ThenInclude(b => b.Property)
            .Include(l => l.Tenant)
            .Include(l => l.Payments)
            .Where(l => l.Status == LeaseStatus.Active);

        if (userRole == "Owner")
        {
            leasesQuery = leasesQuery.Where(l => l.Unit.Building.Property.OwnerId == userId);
        }
        else if (userRole == "PropertyManager")
        {
            leasesQuery = leasesQuery.Where(l => l.Unit.Building.Property.PropertyManagerId == userId);
        }

        var leases = await leasesQuery.ToListAsync();

        var rentRoll = leases.Select(lease =>
        {
            var now = DateTime.UtcNow;
            var currentMonthPayment = lease.Payments
                .FirstOrDefault(p => p.DueDate.Year == now.Year && p.DueDate.Month == now.Month);

            var status = currentMonthPayment?.Status == PaymentStatus.Paid ? "Paid" :
                        currentMonthPayment?.DueDate < now ? "Overdue" : "Upcoming";

            return new
            {
                Id = $"{lease.Id}-{lease.TenantId}",
                TenantName = $"{lease.Tenant.FirstName} {lease.Tenant.LastName}",
                PropertyName = lease.Unit.Building.Property.Name,
                UnitName = lease.Unit.Name,
                Rent = lease.MonthlyRent,
                DueDate = currentMonthPayment?.DueDate ?? new DateTime(now.Year, now.Month, 1),
                Status = status,
                Balance = status == "Overdue" ? lease.MonthlyRent : 0
            };
        });

        return Ok(rentRoll);
    }

    [HttpGet("saved-methods")]
    public async Task<ActionResult<IEnumerable<SavedPaymentMethod>>> GetSavedPaymentMethods()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        var methods = await _context.SavedPaymentMethods
            .Where(m => m.UserId == userId && m.IsActive)
            .ToListAsync();

        return Ok(methods);
    }

    [HttpPost("saved-methods")]
    public async Task<ActionResult<SavedPaymentMethod>> AddPaymentMethod([FromBody] AddPaymentMethodDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        var method = new SavedPaymentMethod
        {
            UserId = userId!,
            Type = dto.Type,
            Last4 = dto.Last4,
            CardBrand = dto.CardBrand,
            BankName = dto.BankName,
            StripePaymentMethodId = dto.StripePaymentMethodId,
            IsPrimary = dto.IsPrimary
        };

        if (dto.IsPrimary)
        {
            var existingMethods = await _context.SavedPaymentMethods
                .Where(m => m.UserId == userId)
                .ToListAsync();

            foreach (var existing in existingMethods)
            {
                existing.IsPrimary = false;
            }
        }

        _context.SavedPaymentMethods.Add(method);
        await _context.SaveChangesAsync();

        return Ok(method);
    }
}
