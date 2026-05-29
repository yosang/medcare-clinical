namespace Models;

public class Patient
{
    // Primay key
    public int Id { get; set; }

    // Attributes
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? NationalIdentityNumber { get; set; }
    public string? PasswordHash { get; set; }
    public bool IsRegistered { get; set; } = false;

    public int RoleId { get; set; } = 1;

    // Nav props
    public Role? Role { get; set; }
    public IEnumerable<Appointment>? Appointments { get; set; }
}