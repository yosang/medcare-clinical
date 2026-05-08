namespace Models;

public class Clinic
{
    // Primary Key
    public int Id { get; set; }

    // Attributes
    public required string Name { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? PostalCode { get; set; }

    // Foreign Keys
    public int CityId { get; set; }

    // Navigation props
    public City? City { get; set; }
    public IEnumerable<Doctor>? Doctors { get; set; }
}