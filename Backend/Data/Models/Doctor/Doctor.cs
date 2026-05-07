namespace Models;

public class Doctor
{
    // Primary Key
    public int Id { get; set; }
    
    // Attributes
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }

    // Foreign Keys
    public int SpecialtyId { get; set; }
    public int ClinicId { get; set; }
}