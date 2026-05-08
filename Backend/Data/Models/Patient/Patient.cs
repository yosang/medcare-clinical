namespace Models;

public class Patient
{
    // Primay key
    public int Id { get; set; }

    // Attributes
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public int? NationalIdentityNumber { get; set; }
    public string? PasswordHash { get; set; }
    public bool IsRegistered { get; set; } = false;

    // Nav props
    public IEnumerable<Appointment>? Appointments { get; set; }
}