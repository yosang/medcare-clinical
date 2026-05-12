using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DTOS;

public class ClinicDTO
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? PostalCode { get; set; }
}

public class ClinicWithDetailsDTO
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? PostalCode { get; set; }

    public CityDTO? City { get; set; }
    public IEnumerable<AppointmentDTO>? Appointments { get; set; }
}

public class CreateClinicDTO
{
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; } = null!;
    
    [Phone]
    public string? Phone { get; set; }
    
    [EmailAddress]
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? PostalCode { get; set; }

    [DefaultValue(1)]
    [Range(1, int.MaxValue)]
    public int CityId { get; set; }
}

public class UpdateClinicDTO
{
    [MinLength(2)]
    [MaxLength(100)]
    public string? Name { get; set; }
    
    [Phone]
    public string? Phone { get; set; }
    
    [EmailAddress]
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? PostalCode { get; set; }

    public int? CityId { get; set; }
}