using System.ComponentModel.DataAnnotations;

namespace DTOS;

public class StatusDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
}

public class StatusWithDetailsDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;

    public IEnumerable<AppointmentDTO>? Appointments { get; set; }
}

public class CreateStatusDTO {
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; } = null!;
}

public class UpdateStatusDTO
{
    [MinLength(2)]
    [MaxLength(100)]
    public string? Name { get; set;}
}