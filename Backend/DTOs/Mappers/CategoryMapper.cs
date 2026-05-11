using DTOS;
using Models;

namespace Services.Mappers;

public static class CategoryMapper
{
    public static CategoryDTO ToCategoryDTO(this Category category)
    {
        return new CategoryDTO
        {
            Id = category.Id,
            Name = category.Name
        };
    }   
}