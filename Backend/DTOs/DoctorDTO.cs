using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DTOS;

public class DoctorDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Email { get; set; }
    public int SpecialtyId { get; set; }
    public int ClinicId { get; set; }

}

public class DoctorWithDetailsDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Email { get; set; }

    public SpecialtyDTO? Specialty { get; set; }
    public ClinicDTO? Clinic { get; set; }
}

public class CreateDoctorDTO {
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string FirstName { get; set; } = null!;

    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string LastName { get; set; } = null!;
    
    [EmailAddress]
    [MinLength(2)]
    [MaxLength(100)]
    public string? Email { get; set; }

    [DefaultValue(1)]
    [Range(1, int.MaxValue)]
    public int SpecialtyId { get; set; }
    [DefaultValue(1)]
    [Range(1, int.MaxValue)]
    public int ClinicId { get; set; }
}

public class UpdateDoctorDTO
{
    [MinLength(2)]
    [MaxLength(100)]
    public string? FirstName { get; set;}
    
    [MinLength(2)]
    [MaxLength(100)]
    public string? LastName { get; set;}

    [EmailAddress]
    [MinLength(2)]
    [MaxLength(100)]
    public string? Email { get; set;}
    [DefaultValue(1)]
    [Range(1, int.MaxValue)]
    public int? SpecialtyId { get; set; }
    [DefaultValue(1)]
    [Range(1, int.MaxValue)]
    public int? ClinicId { get; set; }
}