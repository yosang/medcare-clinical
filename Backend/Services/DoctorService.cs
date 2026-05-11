using Context;
using DTOS;
using Extensions.Mappers;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;
public class DoctorService
{
    private readonly DatabaseContext _ctx;

    public DoctorService(DatabaseContext context)
    {
        _ctx = context;
    }

    public async Task<IEnumerable<DoctorWithDetailsDTO>> GetDoctors()
    {
        var doctors = await _ctx.Doctors.AsNoTracking()
                                        .Include(d => d.Specialty)
                                        .Include(d => d.Clinic)
                                        .Include(d => d.Appointments)
                                        .Select(doctor => doctor.ToDoctorWithDetailsDTO())
                                        .ToListAsync();

        return doctors;
    }

    public async Task<DoctorWithDetailsDTO?> GetDoctor(int id)
    {
        var doctor = await _ctx.Doctors.AsNoTracking()
                                        .Where(doctor => doctor.Id == id)
                                        .Include(d => d.Specialty)
                                        .Include(d => d.Clinic)
                                        .Include(d => d.Appointments)
                                        .Select(doctor => doctor.ToDoctorWithDetailsDTO())                                        
                                        .FirstOrDefaultAsync();
        return doctor;
    }

    public async Task<IEnumerable<AppointmentDTO>> GetAppointments(int id)
    {
        var appointments = await _ctx.Appointments.AsNoTracking()
                                                  .Where(appointment => appointment.DoctorId == id)
                                                  .Select(appointment => appointment.ToAppointmentDTO())
                                                  .ToListAsync();
        return appointments;
    }

    public async Task<DoctorDTO> CreateDoctor(CreateDoctorDTO dto)
    {
        var newDoctor = dto.ToDoctor();

        _ctx.Doctors.Add(newDoctor);

        await _ctx.SaveChangesAsync();
        
        return newDoctor.ToDoctorDTO();
    }

    public async Task<DoctorDTO?> UpdateDoctor(int id, UpdateDoctorDTO dto)
    {
        var existing = await _ctx.Doctors.FindAsync(id);
        if(existing == null) return null;

        existing.FirstName = dto.FirstName;
        existing.LastName = dto.LastName;
        existing.Email = dto.Email;
        existing.SpecialtyId = dto.SpecialtyId;
        existing.ClinicId = dto.ClinicId;

        await _ctx.SaveChangesAsync();

        return existing.ToDoctorDTO();
    }

    public async Task<bool> DeleteDoctor(int id)
    {
        var doctor = await _ctx.Doctors.FindAsync(id);
        if(doctor == null) return false;

        _ctx.Doctors.Remove(doctor);

        await _ctx.SaveChangesAsync();
        
        return true;
    }
}