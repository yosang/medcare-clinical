using Context;
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
                                                    .Select(appointment => new AppointmentWithDetailsDTO
                                                    {
                                                        Id = appointment.Id,
                                                        AppointmentDate = appointment.AppointmentDate,
                                                        Note = appointment.Note,
                                                        Doctor = appointment.Doctor!.ToDoctorDTO(),
                                                        Patient = appointment.Patient!.ToPatientDTO(),
                                                        Category = appointment.Category!.ToCategoryDTO(),
                                                        Status = appointment.Status!.ToStatusDTO(),
                                                        Clinic = appointment.Clinic!.ToClinicDTO(),
                                                    })
                                                    .ToListAsync();
        return appointments;
    }
}