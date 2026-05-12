using Context;
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
                                        .Include(c => c.Appointments)
                                        .Include(c => c.City)
                                        .Select(clinic => clinic.ToClinicWithDetailsDTO())
                                        .ToListAsync();
        return clinics;
    }

    public async Task<ClinicWithDetailsDTO?> GetClinic(int id)
    {
        var clinic = await _ctx.Clinics.AsNoTracking()
                                        .Where(c => c.Id == id)
                                        .Include(c => c.Appointments)
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
    public async Task<IEnumerable<AppointmentDTO>> GetAppointments(int id)
    {
        var appointments = await _ctx.Appointments.AsNoTracking()
                                        .Where(d => d.ClinicId == id)
                                        .Select(d => d.ToAppointmentDTO())
                                        .ToListAsync();
        return appointments;
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

        existing.Name = dto.Name;
        existing.Phone = dto.Phone;
        existing.Email = dto.Email;
        existing.Address = dto.Address;
        existing.PostalCode = dto.PostalCode;
        existing.CityId = dto.CityId;

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