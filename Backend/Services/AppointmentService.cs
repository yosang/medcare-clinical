using Data.Context;
using DTOS;
using Microsoft.EntityFrameworkCore;
using Extensions.Mappers;
using Models;
using Microsoft.AspNetCore.Http.HttpResults;

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

    public async Task<IEnumerable<AppointmentWithDetailsDTO>> GetAppointmentsForPatient(int patientId)
    {
        var appointments = await _ctx.Appointments.AsNoTracking()
                                                    .Include(ap => ap.Doctor)
                                                    .Include(ap => ap.Patient)
                                                    .Include(ap => ap.Category)
                                                    .Include(ap => ap.Status)
                                                    .Include(ap => ap.Clinic)
                                                    .Where(ap => ap.PatientId == patientId)
                                                    .Select(appointment => appointment.ToAppointmentWithDetailsDTO())
                                                    .ToListAsync();
        return appointments;
    }
    public async Task<AppointmentDTO?> CreateAppointment(CreateAppointmentDTO dto)
    {

        var overlaps = await _ctx.Appointments.AsNoTracking().AnyAsync(ap => 
                ap.DoctorId == dto.DoctorId && ap.StatusId != 3 &&
                // if Existing.End >= New.Start = overlap
                ap.AppointmentDate.AddMinutes(ap.Duration) >= dto.AppointmentDate &&

                // If existing.Start <= New.End = overlap
                ap.AppointmentDate <= dto.AppointmentDate.AddMinutes(dto.Duration)

        );

        if(overlaps) return null;

        var newAp = dto.ToAppointment();

        _ctx.Appointments.Add(newAp);

        await _ctx.SaveChangesAsync();

        return newAp.ToAppointmentDTO();
    }

    public async Task<AppointmentDTO?> UpdateAppointment(int id, UpdateAppointmentDTO dto)
    {

        var overlaps = await _ctx.Appointments.AsNoTracking().AnyAsync(ap => 
            ap.DoctorId == dto.DoctorId 
            && ap.StatusId != 3 
            && ap.Id != id // Since this is an update, we are excluding the current appointment
            && ap.AppointmentDate.AddMinutes(ap.Duration) >= dto.AppointmentDate // if Existing.End >= New.Start = overlap
            && ap.AppointmentDate <= dto.AppointmentDate.AddMinutes(dto.Duration) // If existing.Start <= New.End = overlap

        );

        if(overlaps) return null;

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