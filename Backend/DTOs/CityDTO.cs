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
    public string Name { get; set; } = null!;
}

public class UpdateCityDTO
{
    public string Name { get; set;} = null!;
}