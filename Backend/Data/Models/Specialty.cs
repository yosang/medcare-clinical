namespace Models;

public class Specialty
{
    // Primary Key
    public int Id { get; set; }
    // Attributes
    public required string Name { get; set; }
    // Nav props
    public IEnumerable<Doctor>? Doctors { get; set; }
}