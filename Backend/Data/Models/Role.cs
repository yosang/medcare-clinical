using Models;

public class Role
{
    public int Id { get; set; }
    public required string Name { get; set; }

    public IEnumerable<Patient>? Patients { get; set; }
}