using Data.Context;
using DTOS;
using Microsoft.EntityFrameworkCore;
using Extensions.Mappers;

namespace Services;
public class AppointmentService
{
    private readonly DatabaseContext _ctx;

    public AppointmentService(DatabaseContext context)
    {
        _ctx = context;
    }

    public async Task<IEnumerable<AppointmentWithDetailsDTO>> GetAppointments()
    {
        var appointments = await _ctx.Appointments.AsNoTracking()
                                                    .Include(ap => ap.Doctor)
                                                    .Include(ap => ap.Patient)
                                                    .Include(ap => ap.Category)
                                                    .Include(ap => ap.Status)
                                                    .Include(ap => ap.Clinic)
                                                    .Select(appointment => appointment.ToAppointmentWithDetailsDTO())
                                                    .ToListAsync();
        return appointments;
    }

    public async Task<AppointmentWithDetailsDTO?> GetAppointment(int id)
    {
        var appointment = await _ctx.Appointments.AsNoTracking()
                                                    .Where(ap => ap.Id == id)
                                                    .Include(ap => ap.Doctor)
                                                    .Include(ap => ap.Patient)
                                                    .Include(ap => ap.Category)
                                                    .Include(ap => ap.Status)
                                                    .Include(ap => ap.Clinic)
                                                    .Select(appointment => appointment.ToAppointmentWithDetailsDTO())
                                                    .FirstOrDefaultAsync();

        return appointment;
    }

    public async Task<AppointmentDTO> CreateAppointment(CreateAppointmentDTO dto)
    {
        var newAp = dto.ToAppointment();

        _ctx.Appointments.Add(newAp);

        await _ctx.SaveChangesAsync();

        return newAp.ToAppointmentDTO();
    }

    public async Task<AppointmentDTO?> UpdateAppointment(int id, UpdateAppointmentDTO dto)
    {
        var existing = await _ctx.Appointments.FindAsync(id);
        if(existing == null) return null;

        existing.UpdateWith(dto);

        await _ctx.SaveChangesAsync();

        return existing.ToAppointmentDTO();
    }

    public async Task<bool> DeleteAppointment(int id)
    {
        var existing = await _ctx.Appointments.FindAsync(id);
        if(existing == null) return false;

        _ctx.Appointments.Remove(existing);

        await _ctx.SaveChangesAsync();

        return true;
    }
}