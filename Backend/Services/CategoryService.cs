using Context;
using DTOS;
using Extensions.Mappers;
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
                                              .Include(c => c.Appointments)
                                              .Select(category => category.ToCategoryWithDetailsDTO())
                                              .ToListAsync();

        return categories;
    }

    public async Task<CategoryWithDetailsDTO?> GetCategory(int id)
    {
        var category = await _ctx.Categories.AsNoTracking()
                                            .Where(category => category.Id == id)
                                            .Include(c => c.Appointments)
                                            .Select(category => category.ToCategoryWithDetailsDTO())
                                            .FirstOrDefaultAsync();
        return category;
    }

    public async Task<IEnumerable<AppointmentDTO>> GetAppointments(int id)
    {
        var appointments = await _ctx.Appointments.AsNoTracking()
                                                  .Where(appointment => appointment.CategoryId == id)
                                                  .Select(appointment => appointment.ToAppointmentDTO())
                                                  .ToListAsync();
        return appointments;
    }

    public async Task<CategoryDTO> CreateCategory(CreateCategoryDTO dto)
    {
        var newCategory = dto.ToCategory();

        _ctx.Categories.Add(newCategory);

        await _ctx.SaveChangesAsync();
        return newCategory.ToCategoryDTO();
    }

    public async Task<CategoryDTO?> UpdateCategory(int id, UpdateCategoryDTO dto)
    {
        var existing = await _ctx.Categories.FindAsync(id);
        if(existing == null) return null;

        existing.Name = dto.Name;

        await _ctx.SaveChangesAsync();

        return existing.ToCategoryDTO();
    }

    public async Task<bool> DeleteCategory(int id)
    {
        var existing = await _ctx.Categories.FindAsync(id);
        if(existing == null) return false;

        _ctx.Categories.Remove(existing);

        await _ctx.SaveChangesAsync();
        
        return true;
    }
}