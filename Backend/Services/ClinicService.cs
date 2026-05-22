using Data.Context;
using DTOS;
using Extensions.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Services;

public class ClinicService
{
    private readonly DatabaseContext _ctx;

    public ClinicService(DatabaseContext context)
    {
        _ctx = context;
    }

    public async Task<IEnumerable<ClinicWithDetailsDTO>> GetClinics()
    {
        var clinics = await _ctx.Clinics.AsNoTracking()
                                        .Include(c => c.City)
                                        .Select(clinic => clinic.ToClinicWithDetailsDTO())
                                        .ToListAsync();
        return clinics;
    }

    public async Task<ClinicWithDetailsDTO?> GetClinic(int id)
    {
        var clinic = await _ctx.Clinics.AsNoTracking()
                                        .Where(c => c.Id == id)
                                        .Include(c => c.City)
                                        .Select(clinic => clinic.ToClinicWithDetailsDTO())
                                        .FirstOrDefaultAsync();
        return clinic;
    }

    public async Task<IEnumerable<DoctorDTO>> GetDoctors(int id)
    {
        var doctors = await _ctx.Doctors.AsNoTracking()
                                        .Where(d => d.ClinicId == id)
                                        .Select(d => d.ToDoctorDTO())
                                        .ToListAsync();
        return doctors;
    }

    public async Task<ClinicDTO> CreateClinic(CreateClinicDTO dto)
    {
        var newClinic = dto.ToClinic();

        _ctx.Clinics.Add(newClinic);

        await _ctx.SaveChangesAsync();
        
        return newClinic.ToClinicDTO();
    }

    public async Task<ClinicDTO?> UpdateClinic(int id, UpdateClinicDTO dto)
    {
        var existing = await _ctx.Clinics.FindAsync(id);
        if(existing == null) return null;

        existing.UpdateWith(dto);

        await _ctx.SaveChangesAsync();

        return existing.ToClinicDTO();
    }

    public async Task<bool> DeleteClinic(int id)
    {
        var existing = await _ctx.Clinics.FindAsync(id);
        if(existing == null) return false;

        _ctx.Clinics.Remove(existing);

        await _ctx.SaveChangesAsync();

        return true;
    }
}