using Context;
using DTOS;
using Extensions.Mappers;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;
public class SpecialtyService
{
    private readonly DatabaseContext _ctx;

    public SpecialtyService(DatabaseContext context)
    {
        _ctx = context;
    }

    public async Task<IEnumerable<SpecialtyWithDetailsDTO>> GetSpecialties()
    {

        var specialties = await _ctx.Specialties.AsNoTracking()
                                                .Include(s => s.Doctors)
                                                .Select(specialty => specialty.ToSpecialtyWithDetailsDTO())
                                                .ToListAsync();

        return specialties;
    }

    public async Task<SpecialtyWithDetailsDTO?> GetSpecialty(int id)
    {
        var specialty = await _ctx.Specialties.AsNoTracking()
                                              .Where(specialty => specialty.Id == id)
                                              .Include(s => s.Doctors)
                                              .Select(specialty => specialty.ToSpecialtyWithDetailsDTO())
                                              .FirstOrDefaultAsync();
        return specialty;
    }

    public async Task<IEnumerable<DoctorDTO>> GetDoctors(int id)
    {
        var doctors = await _ctx.Doctors.AsNoTracking()
                                        .Where(doctor => doctor.SpecialtyId == id)
                                        .Select(doctor => doctor.ToDoctorDTO())
                                        .ToListAsync();
        return doctors;
    }

    public async Task<Specialty> CreateSpecialty(CreateSpecialtyDTO dto)
    {
        var newSpecialty = dto.ToSpecialty();

        _ctx.Specialties.Add(newSpecialty);

        await _ctx.SaveChangesAsync();

        return newSpecialty;
    }

    public async Task<SpecialtyDTO?> UpdateSpecialty(int id, UpdateSpecialtyDTO dto)
    {
        var existing = await _ctx.Specialties.FindAsync(id);
        if(existing == null) return null;

        existing.Name = dto.Name;

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