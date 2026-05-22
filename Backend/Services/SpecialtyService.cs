using Data.Context;
using DTOS;
using Extensions.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Services;
public class SpecialtyService
{
    private readonly DatabaseContext _ctx;

    public SpecialtyService(DatabaseContext context)
    {
        _ctx = context;
    }

    public async Task<IEnumerable<SpecialtyDTO>> GetSpecialties()
    {

        var specialties = await _ctx.Specialties.AsNoTracking()
                                                .Select(specialty => specialty.ToSpecialtyDTO())
                                                .ToListAsync();

        return specialties;
    }

    public async Task<SpecialtyDTO?> GetSpecialty(int id)
    {
        var specialty = await _ctx.Specialties.AsNoTracking()
                                              .Where(specialty => specialty.Id == id)
                                              .Select(specialty => specialty.ToSpecialtyDTO())
                                              .FirstOrDefaultAsync();
        return specialty;
    }

    public async Task<SpecialtyDTO> CreateSpecialty(CreateSpecialtyDTO dto)
    {
        var newSpecialty = dto.ToSpecialty();

        _ctx.Specialties.Add(newSpecialty);

        await _ctx.SaveChangesAsync();

        return newSpecialty.ToSpecialtyDTO();
    }

    public async Task<SpecialtyDTO?> UpdateSpecialty(int id, UpdateSpecialtyDTO dto)
    {
        var existing = await _ctx.Specialties.FindAsync(id);
        if(existing == null) return null;

        existing.UpdateWith(dto);

        await _ctx.SaveChangesAsync();

        return existing.ToSpecialtyDTO();
    }

    public async Task<bool> DeleteSpecialty(int id)
    {
        var existing = await _ctx.Specialties.FindAsync(id);
        if(existing == null) return false;

        _ctx.Specialties.Remove(existing);

        await _ctx.SaveChangesAsync();
        
        return true;
    }
}