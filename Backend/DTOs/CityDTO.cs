using System.ComponentModel.DataAnnotations;

namespace DTOS;

public class CityDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
}

public class CityWithDetailsDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;

    public IEnumerable<ClinicDTO>? Clinics { get; set; }
}

public class CreateCityDTO {
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; } = null!;
}

public class UpdateCityDTO
{
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set;} = null!;
}