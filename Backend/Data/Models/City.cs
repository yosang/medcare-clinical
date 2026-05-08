namespace Models;

public class City
{
    // Primary Key
    public int Id { get; set;}
    // Attributes
    public required string Name { get; set; }

    // Navigation props
    public IEnumerable<Clinic>? Clinics { get; set; }
}
