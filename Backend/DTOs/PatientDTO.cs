using System.ComponentModel.DataAnnotations;

namespace DTOS;

public class PatientDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public int? NationalIdentityNumber { get; set; }
    public string? PasswordHash { get; set; }
    public bool IsRegistered { get; set; }
}

public class PatientWithDetailsDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public int? NationalIdentityNumber { get; set; }
    public string? PasswordHash { get; set; }
    public bool IsRegistered { get; set; }

    public IEnumerable<AppointmentDTO>? Appointments { get; set; }
}

public class CreatePatientDTO
{
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string FirstName { get; set; } = null!;

    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string LastName { get; set; } = null!;

    [Phone]
    public string? Phone { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    [DataType(DataType.Date)]
    public DateTime? DateOfBirth { get; set; }

    public int? NationalIdentityNumber { get; set; }
    public string? PasswordHash { get; set; }
    public bool IsRegistered { get; set; }
}

public class UpdatePatientDTO
{
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string FirstName { get; set; } = null!;

    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string LastName { get; set; } = null!;

    [Phone]
    public string? Phone { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    [DataType(DataType.Date)]
    public DateTime? DateOfBirth { get; set; }

    public int? NationalIdentityNumber { get; set; }
    public string? PasswordHash { get; set; }
    public bool IsRegistered { get; set; }
}