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

    /// <summary> Reads categories from the database without tracking for reduced performance overhead </summary>
    /// <returns> List of categories </returns>
    public async Task<IEnumerable<CategoriesDTO>> GetCategories()
    {

        var categories = await _ctx.Categories.AsNoTracking()
                                              .Select(category => category.ToCategoriesDTO())
                                              .ToListAsync();

        return categories;
    }

    /// <summary> Reads a single category from the database without tracking for reduced performance overhead </summary>
    /// <param name="id"></param>
    /// <returns> A single category </returns>
    public async Task<CategoriesDTO?> GetCategory(int id)
    {
        var category = await _ctx.Categories.AsNoTracking()
                                            .Where(category => category.Id == id)
                                            .Select(category => category.ToCategoriesDTO())
                                            .FirstOrDefaultAsync();
        return category;
    }

    /// <summary> Writes a new category entity to the database </summary>
    /// <param name="dto"></param>
    /// <returns> Created category </returns>
    public async Task<CategoriesDTO> CreateCategory(CreateCategoryDTO dto)
    {
        var newCategory = dto.ToCategory();

        _ctx.Categories.Add(newCategory);

        await _ctx.SaveChangesAsync();
        return newCategory.ToCategoriesDTO();
    }

    /// <summary> Updates an existing category </summary>
    /// <param name="id"></param>
    /// <param name="dto"></param>
    /// <returns> Updated category </returns>
    public async Task<CategoriesDTO?> UpdateCategory(int id, UpdateCategoryDTO dto)
    {
        var existing = await _ctx.Categories.FindAsync(id);
        if(existing == null) return null;

        existing.UpdateWith(dto);

        await _ctx.SaveChangesAsync();

        return existing.ToCategoriesDTO();
    }

    /// <summary> Deletes an existing category </summary>
    /// <param name="id"></param>
    /// <returns> Boolean representation of deletion result </returns>
    public async Task<bool> DeleteCategory(int id)
    {
        var existing = await _ctx.Categories.FindAsync(id);
        if(existing == null) return false;

        _ctx.Categories.Remove(existing);

        await _ctx.SaveChangesAsync();
        
        return true;
    }
}