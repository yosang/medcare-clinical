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

    /// <summary> Reads appointments for a patient from the database without tracking for reduced performance overhead </summary>
    /// <param name="patientId"></param>
    /// <returns> List of appointments </returns>
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
    
    /// <summary> Reads a single appointment for a patient from the database without tracking for reduced performance overhead </summary>
    /// <param name="id"></param>
    /// <param name="patientId"></param>
    /// <returns> A single appointment </returns>
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

    /// <summary> 
    /// Writes a new appointment entity to the database </summary>
    /// <param name="dto"></param>
    /// <returns> Created appointment or null </returns>
    public async Task<AppointmentDTO?> CreateAppointment(CreateAppointmentDTO dto)
    {

        // Overlap logic:
        // if (Existing.End > New.Start) = overlap
        // If (existing.Start < New.End) = overlap
        var doctorOverlap = await _ctx.Appointments.AsNoTracking().AnyAsync(ap => 
                                                                            ap.DoctorId == dto.DoctorId && ap.StatusId != 3 &&
                                                                            ap.AppointmentDate.AddMinutes(ap.Duration) > dto.AppointmentDate &&
                                                                            ap.AppointmentDate < dto.AppointmentDate.AddMinutes(dto.Duration)
                                                                        );

        var patientOverlap = await _ctx.Appointments.AsNoTracking().AnyAsync(ap => 
                                                                            ap.PatientId == dto.PatientId && ap.StatusId != 3 &&                                      
                                                                            ap.AppointmentDate.AddMinutes(ap.Duration) > dto.AppointmentDate &&
                                                                            ap.AppointmentDate < dto.AppointmentDate.AddMinutes(dto.Duration)
                                                                        );

        if (patientOverlap || doctorOverlap) return null;

        var newAp = dto.ToAppointment();

        _ctx.Appointments.Add(newAp);

        await _ctx.SaveChangesAsync();

        return newAp.ToAppointmentDTO();
    }

    /// <summary> Updates an existing appointment </summary>
    /// <param name="id"></param>
    /// <param name="patientId"></param>
    /// <param name="dto"></param>
    /// <returns> Tuple representation of notFound / overlap results </returns>
    public async Task<( bool notFound, bool overlap )> UpdateAppointment(int id, int patientId, UpdateAppointmentDTO dto)
    {

        var existing = await _ctx.Appointments.FirstOrDefaultAsync(ap => ap.Id == id && ap.PatientId == patientId);
        
        if(existing == null) return ( notFound: true, overlap: false );

        var overlaps = await _ctx.Appointments.AsNoTracking().AnyAsync(ap => 
                                                                            ap.DoctorId == dto.DoctorId 
                                                                            && ap.StatusId != 3 
                                                                            && ap.Id != id // Excludes the current appointment from overlap matching so that we can update it
                                                                            && ap.AppointmentDate.AddMinutes(ap.Duration) > dto.AppointmentDate 
                                                                            && ap.AppointmentDate < dto.AppointmentDate.AddMinutes(dto.Duration)

                                                                        );

        if(overlaps) return ( notFound: false, overlap: true );

        existing.UpdateWith(dto);
        
        await _ctx.SaveChangesAsync();
        return ( notFound: false, overlap: false );
    }

    /// <summary> Sets an appoint to status cancelled </summary>
    /// <param name="id"></param>
    /// <param name="patientId"></param>
    /// <returns> Boolean representation of result </returns>
    public async Task<bool> CancelAppointment(int id, int patientId)
    {
        var existing = await _ctx.Appointments.FirstOrDefaultAsync(a => a.Id == id && a.PatientId == patientId);
        if(existing == null) return false;

        if(existing.StatusId == 2 || existing.StatusId == 3) return false; // Return early if the appointment is already cancelled or completed.

        existing.StatusId = 3;

        await _ctx.SaveChangesAsync();

        return true;
    }
}