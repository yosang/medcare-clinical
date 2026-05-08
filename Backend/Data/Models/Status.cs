namespace Models;

public class Status
{
    // Primary key
    public int Id { get; set; }
    // Attribute
    public required string Name { get; set; }
    // Nav prop
    public IEnumerable<Appointment>? Appointments { get; set; }
}