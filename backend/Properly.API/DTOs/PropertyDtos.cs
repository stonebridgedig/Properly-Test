using System.ComponentModel.DataAnnotations;

namespace Properly.API.DTOs;

public class CreatePropertyDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;

    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string? Country { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? OwnerId { get; set; }
}

public class UpdatePropertyDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;

    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string? Country { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? OwnerId { get; set; }
}

public class CreateBuildingDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
}

public class CreateUnitDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Range(0, 10)]
    public int Bedrooms { get; set; }

    [Range(0, 10)]
    public decimal Bathrooms { get; set; }

    [Range(0, 10000)]
    public decimal SquareFeet { get; set; }

    [Range(0, 100000)]
    public decimal MonthlyRent { get; set; }
}
