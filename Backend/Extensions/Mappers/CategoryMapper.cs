using DTOS;
using Models;

namespace Extensions.Mappers;

public static class CategoryMapper
{
    public static CategoriesDTO ToCategoriesDTO(this Category category)
    {
        return new CategoriesDTO
        {
            Id = category.Id,
            Name = category.Name
        };
    }

    public static Category ToCategory(this CreateCategoryDTO dto)
    {
        return new Category
        {
            Name = dto.Name,
        };
    }

    public static void UpdateWith(this Category existing, UpdateCategoryDTO dto)
    {
        if(!string.IsNullOrWhiteSpace(dto.Name)) existing.Name = dto.Name;
    }
}