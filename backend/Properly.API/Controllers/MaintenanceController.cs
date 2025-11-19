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
public class MaintenanceController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly INotificationService _notificationService;
    private readonly IFileStorageService _fileStorageService;

    public MaintenanceController(
        ApplicationDbContext context,
        INotificationService notificationService,
        IFileStorageService fileStorageService)
    {
        _context = context;
        _notificationService = notificationService;
        _fileStorageService = fileStorageService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MaintenanceRequest>>> GetMaintenanceRequests()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        IQueryable<MaintenanceRequest> query = _context.MaintenanceRequests
            .Include(m => m.Unit)
                .ThenInclude(u => u.Building)
                    .ThenInclude(b => b.Property)
            .Include(m => m.Tenant)
            .Include(m => m.AssignedVendor)
            .Include(m => m.Photos)
            .Include(m => m.Updates);

        if (userRole == "Tenant")
        {
            query = query.Where(m => m.TenantId == userId);
        }
        else if (userRole == "Owner")
        {
            query = query.Where(m => m.Unit.Building.Property.OwnerId == userId);
        }
        else if (userRole == "PropertyManager")
        {
            query = query.Where(m => m.Unit.Building.Property.PropertyManagerId == userId);
        }

        return await query.OrderByDescending(m => m.SubmittedDate).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MaintenanceRequest>> GetMaintenanceRequest(int id)
    {
        var request = await _context.MaintenanceRequests
            .Include(m => m.Unit)
                .ThenInclude(u => u.Building)
                    .ThenInclude(b => b.Property)
            .Include(m => m.Tenant)
            .Include(m => m.AssignedVendor)
            .Include(m => m.Photos)
            .Include(m => m.Updates)
                .ThenInclude(u => u.UpdatedBy)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (request == null)
        {
            return NotFound();
        }

        return request;
    }

    [Authorize(Roles = "Tenant")]
    [HttpPost]
    public async Task<ActionResult<MaintenanceRequest>> CreateMaintenanceRequest([FromBody] CreateMaintenanceRequestDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        var request = new MaintenanceRequest
        {
            UnitId = dto.UnitId,
            TenantId = userId!,
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            Category = dto.Category,
            Status = MaintenanceStatus.Submitted
        };

        _context.MaintenanceRequests.Add(request);
        await _context.SaveChangesAsync();

        await _notificationService.NotifyMaintenanceRequestAsync(request);

        return CreatedAtAction(nameof(GetMaintenanceRequest), new { id = request.Id }, request);
    }

    [Authorize(Roles = "PropertyManager")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMaintenanceRequest(int id, [FromBody] UpdateMaintenanceRequestDto dto)
    {
        var request = await _context.MaintenanceRequests.FindAsync(id);

        if (request == null)
        {
            return NotFound();
        }

        request.Status = dto.Status;
        request.Priority = dto.Priority;
        request.AssignedVendorId = dto.AssignedVendorId;
        request.ScheduledDate = dto.ScheduledDate;
        request.EstimatedCost = dto.EstimatedCost;
        request.ActualCost = dto.ActualCost;
        request.Notes = dto.Notes;
        request.UpdatedAt = DateTime.UtcNow;

        if (dto.Status == MaintenanceStatus.Completed)
        {
            request.CompletedDate = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id}/photos")]
    public async Task<ActionResult<MaintenancePhoto>> UploadPhoto(int id, [FromForm] IFormFile file)
    {
        var request = await _context.MaintenanceRequests.FindAsync(id);

        if (request == null)
        {
            return NotFound();
        }

        using var stream = file.OpenReadStream();
        var fileUrl = await _fileStorageService.UploadFileAsync(stream, file.FileName, file.ContentType);

        var photo = new MaintenancePhoto
        {
            MaintenanceRequestId = id,
            PhotoUrl = fileUrl
        };

        _context.MaintenancePhotos.Add(photo);
        await _context.SaveChangesAsync();

        return Ok(photo);
    }

    [HttpPost("{id}/updates")]
    public async Task<ActionResult<MaintenanceUpdate>> AddUpdate(int id, [FromBody] AddMaintenanceUpdateDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        var update = new MaintenanceUpdate
        {
            MaintenanceRequestId = id,
            UpdatedById = userId!,
            Message = dto.Message
        };

        _context.MaintenanceUpdates.Add(update);
        await _context.SaveChangesAsync();

        return Ok(update);
    }
}
