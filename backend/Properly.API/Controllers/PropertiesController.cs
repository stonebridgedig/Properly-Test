using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Properly.API.Data;
using Properly.API.DTOs;
using Properly.API.Models;

namespace Properly.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PropertiesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Property>>> GetProperties()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        IQueryable<Property> query = _context.Properties
            .Include(p => p.Buildings)
                .ThenInclude(b => b.Units)
                    .ThenInclude(u => u.Syndication)
            .Include(p => p.Buildings)
                .ThenInclude(b => b.Units)
                    .ThenInclude(u => u.Leases);

        if (userRole == "Owner")
        {
            query = query.Where(p => p.OwnerId == userId);
        }
        else if (userRole == "PropertyManager")
        {
            query = query.Where(p => p.PropertyManagerId == userId);
        }

        return await query.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Property>> GetProperty(int id)
    {
        var property = await _context.Properties
            .Include(p => p.Buildings)
                .ThenInclude(b => b.Units)
                    .ThenInclude(u => u.Syndication)
            .Include(p => p.Buildings)
                .ThenInclude(b => b.Units)
                    .ThenInclude(u => u.Leases)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (property == null)
        {
            return NotFound();
        }

        return property;
    }

    [Authorize(Policy = "PropertyManager")]
    [HttpPost]
    public async Task<ActionResult<Property>> CreateProperty([FromBody] CreatePropertyDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        var property = new Property
        {
            Name = dto.Name,
            Address = dto.Address,
            City = dto.City,
            State = dto.State,
            ZipCode = dto.ZipCode,
            Country = dto.Country,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            PropertyManagerId = userId,
            OwnerId = dto.OwnerId
        };

        _context.Properties.Add(property);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
    }

    [Authorize(Policy = "PropertyManager")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProperty(int id, [FromBody] UpdatePropertyDto dto)
    {
        var property = await _context.Properties.FindAsync(id);

        if (property == null)
        {
            return NotFound();
        }

        property.Name = dto.Name;
        property.Address = dto.Address;
        property.City = dto.City;
        property.State = dto.State;
        property.ZipCode = dto.ZipCode;
        property.Country = dto.Country;
        property.Latitude = dto.Latitude;
        property.Longitude = dto.Longitude;
        property.OwnerId = dto.OwnerId;
        property.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Policy = "PropertyManager")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProperty(int id)
    {
        var property = await _context.Properties.FindAsync(id);

        if (property == null)
        {
            return NotFound();
        }

        _context.Properties.Remove(property);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Policy = "PropertyManager")]
    [HttpPost("{propertyId}/buildings")]
    public async Task<ActionResult<Building>> AddBuilding(int propertyId, [FromBody] CreateBuildingDto dto)
    {
        var property = await _context.Properties.FindAsync(propertyId);

        if (property == null)
        {
            return NotFound();
        }

        var building = new Building
        {
            Name = dto.Name,
            PropertyId = propertyId
        };

        _context.Buildings.Add(building);
        await _context.SaveChangesAsync();

        return Ok(building);
    }

    [Authorize(Policy = "PropertyManager")]
    [HttpPost("{propertyId}/buildings/{buildingId}/units")]
    public async Task<ActionResult<Unit>> AddUnit(int propertyId, int buildingId, [FromBody] CreateUnitDto dto)
    {
        var building = await _context.Buildings
            .Include(b => b.Property)
            .FirstOrDefaultAsync(b => b.Id == buildingId && b.PropertyId == propertyId);

        if (building == null)
        {
            return NotFound();
        }

        var unit = new Unit
        {
            Name = dto.Name,
            Bedrooms = dto.Bedrooms,
            Bathrooms = dto.Bathrooms,
            SquareFeet = dto.SquareFeet,
            MonthlyRent = dto.MonthlyRent,
            BuildingId = buildingId,
            Status = UnitStatus.Vacant
        };

        _context.Units.Add(unit);
        await _context.SaveChangesAsync();

        return Ok(unit);
    }
}
