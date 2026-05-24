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
    public async Task<AppointmentWithDetailsDTO?> GetAppointment(int id, int patientId)
    {
        var appointment = await _ctx.Appointments.AsNoTracking()
                                                    .Include(ap => ap.Doctor)
                                                    .Include(ap => ap.Patient)
                                                    .Include(ap => ap.Category)
                                                    .Include(ap => ap.Status)
                                                    .Include(ap => ap.Clinic)
                                                    .Where(ap => ap.Id == id && ap.PatientId == patientId)
                                                    .Select(appointment => appointment.ToAppointmentWithDetailsDTO())
                                                    .FirstOrDefaultAsync();

        return appointment;
    }

    public async Task<AppointmentDTO?> CreateAppointment(CreateAppointmentDTO dto)
    {

        // Overlap logic:
        // if Existing.End >= New.Start = overlap
        // If existing.Start <= New.End = overlap
        var doctorOverlap = await _ctx.Appointments.AsNoTracking().AnyAsync(ap => 
                                                                            ap.DoctorId == dto.DoctorId && ap.StatusId != 3 &&
                                                                            ap.AppointmentDate.AddMinutes(ap.Duration) >= dto.AppointmentDate &&
                                                                            ap.AppointmentDate <= dto.AppointmentDate.AddMinutes(dto.Duration)
                                                                        );

        var patientOverlap = await _ctx.Appointments.AsNoTracking().AnyAsync(ap => 
                                                                            ap.PatientId == dto.PatientId && ap.StatusId != 3 &&                                      
                                                                            ap.AppointmentDate.AddMinutes(ap.Duration) >= dto.AppointmentDate &&
                                                                            ap.AppointmentDate <= dto.AppointmentDate.AddMinutes(dto.Duration)
                                                                        );

        if (patientOverlap || doctorOverlap) return null;

        var newAp = dto.ToAppointment();

        _ctx.Appointments.Add(newAp);

        await _ctx.SaveChangesAsync();

        return newAp.ToAppointmentDTO();
    }

    public async Task<( bool notFound, bool overlap )> UpdateAppointment(int id, int patientId, UpdateAppointmentDTO dto)
    {

        var existing = await _ctx.Appointments.FirstOrDefaultAsync(ap => ap.Id == id && ap.PatientId == patientId);
        if(existing == null) return ( notFound: true, overlap: false );

        var overlaps = await _ctx.Appointments.AsNoTracking().AnyAsync(ap => 
            ap.DoctorId == dto.DoctorId 
            && ap.StatusId != 3 
            && ap.Id != id // Since this is an own update, we are excluding the current appointment
            && ap.AppointmentDate.AddMinutes(ap.Duration) >= dto.AppointmentDate // if Existing.End >= New.Start = overlap
            && ap.AppointmentDate <= dto.AppointmentDate.AddMinutes(dto.Duration) // If existing.Start <= New.End = overlap

        );

        if(overlaps) return ( notFound: false, overlap: true );

        existing.UpdateWith(dto);
        
        await _ctx.SaveChangesAsync();
        return ( notFound: false, overlap: false );
    }

    public async Task<bool> CancelAppointment(int id, int patientId)
    {
        var existing = await _ctx.Appointments.FirstOrDefaultAsync(a => a.Id == id && a.PatientId == patientId);
        if(existing == null) return false;

        if(existing.StatusId == 2 || existing.StatusId == 3) return false; // Dont cancel appointments that are already cancelled or completed

        existing.StatusId = 3;

        await _ctx.SaveChangesAsync();

        return true;
    }
}