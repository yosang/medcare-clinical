using System.ComponentModel.DataAnnotations;

namespace DTOS;

public class SpecialtyDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
}

public class SpecialtyWithDetailsDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;

    public IEnumerable<DoctorDTO>? Doctors { get; set; }
}

public class CreateSpecialtyDTO {
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; } = null!;
}

public class UpdateSpecialtyDTO
{
    [MinLength(2)]
    [MaxLength(100)]
    public string? Name { get; set;}
}