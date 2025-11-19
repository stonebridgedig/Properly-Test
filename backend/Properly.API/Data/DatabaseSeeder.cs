using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Properly.API.Data;
using Properly.API.Models;

namespace Properly.API.Data;

public class DatabaseSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public DatabaseSeeder(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task SeedAsync()
    {
        // Seed Roles
        await SeedRolesAsync();

        // Seed Users
        await SeedUsersAsync();

        // Seed Sample Data
        await SeedPropertiesAsync();
    }

    private async Task SeedRolesAsync()
    {
        var roles = new[] { "PropertyManager", "Owner", "Tenant" };

        foreach (var roleName in roles)
        {
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }
    }

    private async Task SeedUsersAsync()
    {
        // Create Property Manager
        if (await _userManager.FindByEmailAsync("manager@properly.com") == null)
        {
            var manager = new ApplicationUser
            {
                UserName = "manager@properly.com",
                Email = "manager@properly.com",
                FirstName = "John",
                LastName = "Manager",
                EmailConfirmed = true
            };

            await _userManager.CreateAsync(manager, "Manager123!");
            await _userManager.AddToRoleAsync(manager, "PropertyManager");
        }

        // Create Owner
        if (await _userManager.FindByEmailAsync("owner@properly.com") == null)
        {
            var owner = new ApplicationUser
            {
                UserName = "owner@properly.com",
                Email = "owner@properly.com",
                FirstName = "Sarah",
                LastName = "Owner",
                EmailConfirmed = true
            };

            await _userManager.CreateAsync(owner, "Owner123!");
            await _userManager.AddToRoleAsync(owner, "Owner");
        }

        // Create Tenant
        if (await _userManager.FindByEmailAsync("tenant@properly.com") == null)
        {
            var tenant = new ApplicationUser
            {
                UserName = "tenant@properly.com",
                Email = "tenant@properly.com",
                FirstName = "Sophia",
                LastName = "Nguyen",
                EmailConfirmed = true
            };

            await _userManager.CreateAsync(tenant, "Tenant123!");
            await _userManager.AddToRoleAsync(tenant, "Tenant");
        }
    }

    private async Task SeedPropertiesAsync()
    {
        if (await _context.Properties.AnyAsync())
        {
            return; // Already seeded
        }

        var manager = await _userManager.FindByEmailAsync("manager@properly.com");
        var owner = await _userManager.FindByEmailAsync("owner@properly.com");

        if (manager == null || owner == null) return;

        var property = new Property
        {
            Name = "The Grand Apartments",
            Address = "123 Main St",
            City = "Anytown",
            State = "CA",
            ZipCode = "12345",
            Country = "USA",
            Latitude = 34.0522,
            Longitude = -118.2437,
            PropertyManagerId = manager.Id,
            OwnerId = owner.Id
        };

        _context.Properties.Add(property);
        await _context.SaveChangesAsync();

        var building = new Building
        {
            Name = "Main Building",
            PropertyId = property.Id
        };

        _context.Buildings.Add(building);
        await _context.SaveChangesAsync();

        var unit = new Unit
        {
            Name = "Unit 101",
            Bedrooms = 2,
            Bathrooms = 1,
            SquareFeet = 850,
            MonthlyRent = 1800,
            BuildingId = building.Id,
            Status = UnitStatus.Vacant
        };

        _context.Units.Add(unit);
        await _context.SaveChangesAsync();
    }
}
