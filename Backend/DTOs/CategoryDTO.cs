using System.ComponentModel.DataAnnotations;

namespace DTOS;

public class CategoriesDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
}

public class CreateCategoryDTO {
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; } = null!;
}

public class UpdateCategoryDTO
{
    [MinLength(2)]
    [MaxLength(100)]
    public string? Name { get; set;}
}