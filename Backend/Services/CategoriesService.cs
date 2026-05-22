using Data.Context;
using DTOS;
using Extensions.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Services;
public class CategoriesService
{
    private readonly DatabaseContext _ctx;

    public CategoriesService(DatabaseContext context)
    {
        _ctx = context;
    }

    public async Task<IEnumerable<CategoriesDTO>> GetCategories()
    {

        var categories = await _ctx.Categories.AsNoTracking()
                                              .Select(category => category.ToCategoriesDTO())
                                              .ToListAsync();

        return categories;
    }

    public async Task<CategoriesDTO?> GetCategory(int id)
    {
        var category = await _ctx.Categories.AsNoTracking()
                                            .Where(category => category.Id == id)
                                            .Select(category => category.ToCategoriesDTO())
                                            .FirstOrDefaultAsync();
        return category;
    }

    public async Task<CategoriesDTO> CreateCategory(CreateCategoryDTO dto)
    {
        var newCategory = dto.ToCategory();

        _ctx.Categories.Add(newCategory);

        await _ctx.SaveChangesAsync();
        return newCategory.ToCategoriesDTO();
    }

    public async Task<CategoriesDTO?> UpdateCategory(int id, UpdateCategoryDTO dto)
    {
        var existing = await _ctx.Categories.FindAsync(id);
        if(existing == null) return null;

        existing.UpdateWith(dto);

        await _ctx.SaveChangesAsync();

        return existing.ToCategoriesDTO();
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