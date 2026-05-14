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
    public string? NationalIdentityNumber { get; set; }
    public bool IsRegistered { get; set; }
}
public class GuestPatientDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Phone { get; set; }
}

public class PatientWithDetailsDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? NationalIdentityNumber { get; set; }
    public string? PasswordHash { get; set; }
    public bool IsRegistered { get; set; }

    public IEnumerable<AppointmentDTO>? Appointments { get; set; }
}

public class CreateGuestPatientDTO
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
    public string? Phone { get; set; }  = null!;
}

public class UpdatePatientDTO
{
    [MinLength(2)]
    [MaxLength(100)]
    public string? FirstName { get; set; }
    [MinLength(2)]
    [MaxLength(100)]
    public string? LastName { get; set; }

    [Phone]
    public string? Phone { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    [DataType(DataType.Date)]
    public DateTime? DateOfBirth { get; set; }

    [MinLength(11)]
    [MaxLength(11)]
    public string? NationalIdentityNumber { get; set; }
    public string? PasswordHash { get; set; }
    public bool? IsRegistered { get; set; }
}

public class RegisterPatientDTO
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

    [Required]
    [EmailAddress]
    public string? Email { get; set; }

    [Required]
    [DataType(DataType.Date)]
    public DateTime? DateOfBirth { get; set; }

    [Required]
    [MinLength(11)]
    [MaxLength(11)]
    public string? NationalIdentityNumber { get; set; }
    
    [Required]
    public string? Password { get; set; }
    public bool IsRegistered { get; set; }
}

public class LoginPatientDTO
{
    [Required]
    public string Email { get; set; } = null!;
    
    [Required]
    public string Password { get; set; } = null!;
}