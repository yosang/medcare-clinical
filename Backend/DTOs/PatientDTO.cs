namespace DTOS;

public class PatientDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public int? NationalIdentityNumber { get; set; }
    public bool IsRegistered { get; set; }
}