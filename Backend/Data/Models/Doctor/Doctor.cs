namespace Models;

public class Doctor
{
    // Primary Key
    public int Id { get; set; }

    // Attributes
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? Email { get; set; }

    // Foreign Keys
    public int SpecialtyId { get; set; }
    public int ClinicId { get; set; }

    // Nav props
    public Specialty? Specialty { get; set; }
    public Clinic? Clinic { get; set; }
    public IEnumerable<Appointment>? Appointments { get; set; }
}