using DTOS;
using Models;

namespace Extensions.Mappers;

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