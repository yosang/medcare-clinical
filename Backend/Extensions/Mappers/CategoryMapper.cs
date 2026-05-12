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

    public static CategoryWithDetailsDTO ToCategoryWithDetailsDTO(this Category category)
    {
        return new CategoryWithDetailsDTO
        {
            Id = category.Id,
            Name = category.Name,
            Appointments = category.Appointments?.Select(appointments => appointments.ToAppointmentDTO())
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