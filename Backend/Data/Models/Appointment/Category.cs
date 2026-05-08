namespace Models; 

public class Category
{
    // Primary key
    public int Id { get; set; }
    // Attribute
    public required string Name { get; set; }
    // Nav prop
    public IEnumerable<Appointment>? Appointments { get; set; }
}