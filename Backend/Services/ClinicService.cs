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

    /// <summary> Reads clinics from the database without tracking for reduced performance overhead </summary>
    /// <returns>List of clinics</returns>
    public async Task<IEnumerable<ClinicWithDetailsDTO>> GetClinics()
    {
        var clinics = await _ctx.Clinics.AsNoTracking()
                                        .Include(c => c.City)
                                        .Select(clinic => clinic.ToClinicWithDetailsDTO())
                                        .ToListAsync();
        return clinics;
    }

    /// <summary> Reads a single clinic from the database without tracking for reduced performance overhead </summary>
    /// <param name="id"></param>
    /// <returns>A single clinic</returns>
    public async Task<ClinicWithDetailsDTO?> GetClinic(int id)
    {
        var clinic = await _ctx.Clinics.AsNoTracking()
                                        .Where(c => c.Id == id)
                                        .Include(c => c.City)
                                        .Select(clinic => clinic.ToClinicWithDetailsDTO())
                                        .FirstOrDefaultAsync();
        return clinic;
    }

    /// <summary> Reads the database for a lsit of doctors for a specific clinic </summary>
    /// <param name="id"></param>
    /// <returns>List of doctors</returns>
    public async Task<IEnumerable<DoctorDTO>> GetDoctors(int id)
    {
        var doctors = await _ctx.Doctors.AsNoTracking()
                                        .Where(d => d.ClinicId == id)
                                        .Select(d => d.ToDoctorDTO())
                                        .ToListAsync();
        return doctors;
    }

    /// <summary> Writes a new clinic entity to the database </summary>
    /// <param name="dto"></param>
    /// <returns>Created clinic</returns>
    public async Task<ClinicDTO> CreateClinic(CreateClinicDTO dto)
    {
        var newClinic = dto.ToClinic();

        _ctx.Clinics.Add(newClinic);

        await _ctx.SaveChangesAsync();
        
        return newClinic.ToClinicDTO();
    }

    /// <summary> Updates an existing clinic </summary>
    /// <param name="id"></param>
    /// <param name="dto"></param>
    /// <returns>Updated clinic</returns>
    public async Task<ClinicDTO?> UpdateClinic(int id, UpdateClinicDTO dto)
    {
        var existing = await _ctx.Clinics.FindAsync(id);
        if(existing == null) return null;

        existing.UpdateWith(dto);

        await _ctx.SaveChangesAsync();

        return existing.ToClinicDTO();
    }

    /// <summary> Deletes an existing clinic </summary>
    /// <param name="id"></param>
    /// <returns>Boolean representation of deletion result</returns>
    public async Task<bool> DeleteClinic(int id)
    {
        var existing = await _ctx.Clinics.FindAsync(id);
        if(existing == null) return false;

        _ctx.Clinics.Remove(existing);

        await _ctx.SaveChangesAsync();

        return true;
    }
}