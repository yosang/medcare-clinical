using System.ComponentModel.DataAnnotations;

namespace DTOS;

public class CategoryDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
}

public class CategoryWithDetailsDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;

    public IEnumerable<AppointmentDTO>? Appointments { get; set; }
}

public class CreateCategoryDTO {
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; } = null!;
}

public class UpdateCategoryDTO
{
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set;} = null!;
}