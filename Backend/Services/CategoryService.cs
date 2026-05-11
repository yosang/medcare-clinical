using Context;
using DTOS;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;
public class CategoryService
{
    private readonly DatabaseContext _ctx;

    public CategoryService(DatabaseContext context)
    {
        _ctx = context;
    }

    public async Task<IEnumerable<CategoryWithDetailsDTO>> GetCategories()
    {

        var categories = await _ctx.Categories.AsNoTracking()
                                            .Select(category => new CategoryWithDetailsDTO
                                            {
                                                Id = category.Id,
                                                Name = category.Name,
                                                Appointments = category.Appointments!.Select(appointment => new AppointmentDTO
                                                {
                                                    Id = appointment.Id,
                                                    AppointmentDate = appointment.AppointmentDate,
                                                    Note = appointment.Note
                                                })
                                            }).ToListAsync();

        return categories;
    }

    public async Task<CategoryWithDetailsDTO?> GetCategory(int id)
    {
        var category = await _ctx.Categories.AsNoTracking()
                                        .Where(category => category.Id == id)
                                        .Select(category => new CategoryWithDetailsDTO
                                        {
                                            Id = category.Id,
                                            Name = category.Name,
                                            Appointments = category.Appointments!.Select(appointment => new AppointmentDTO
                                            {
                                                Id = appointment.Id,
                                                AppointmentDate = appointment.AppointmentDate,
                                                Note = appointment.Note
                                            })
                                        }).FirstOrDefaultAsync();
        return category;
    }

    public async Task<IEnumerable<AppointmentDTO>> GetAppointments(int id)
    {
        var appointments = await _ctx.Appointments.AsNoTracking()
                                        .Where(appointment => appointment.CategoryId == id)
                                        .Select(appointment => new AppointmentDTO
                                        {
                                            Id = appointment.Id,
                                            AppointmentDate = appointment.AppointmentDate,
                                            Note = appointment.Note
                                        })
                                        .ToListAsync();
        return appointments;
    }

    public async Task<Category> CreateCategory(CreateCategoryDTO category)
    {
        var newCategory = new Category
        {
            Name = category.Name
        };

        _ctx.Categories.Add(newCategory);

        await _ctx.SaveChangesAsync();
        return newCategory;
    }

    public async Task<CategoryDTO?> UpdateCategory(int id, UpdateCategoryDTO category)
    {
        var existingCategory = await _ctx.Categories.FindAsync(id);
        if(existingCategory == null) return null;

        existingCategory.Name = category.Name;

        await _ctx.SaveChangesAsync();

        return new CategoryDTO
        {
            Id = existingCategory.Id,
            Name = existingCategory.Name
        };
    }

    public async Task<bool> DeleteCategory(int id)
    {
        var category = await _ctx.Categories.FindAsync(id);
        if(category == null) return false;

        _ctx.Remove(category);

        await _ctx.SaveChangesAsync();
        
        return true;
    }
}