namespace DTOS;

public class ClinicDTO
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? PostalCode { get; set; }
}