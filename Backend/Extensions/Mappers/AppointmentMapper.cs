using DTOS;
using Models;

namespace Extensions.Mappers;

public static class AppointmentMapper
{
    public static AppointmentWithDetailsDTO ToAppointmentWithDetailsDTO(this Appointment appointment)
    {
        return new AppointmentWithDetailsDTO
            {
                Id = appointment.Id,
                AppointmentDate = appointment.AppointmentDate,
                Note = appointment.Note,
                Doctor = appointment.Doctor!.ToDoctorDTO(),
                Patient = appointment.Patient!.ToPatientDTO(),
                Category = appointment.Category!.ToCategoryDTO(),
                Status = appointment.Status!.ToStatusDTO(),
                Clinic = appointment.Clinic!.ToClinicDTO(),
            };
    }

    public static AppointmentDTO ToAppointmentDTO(this Appointment appointment)
    {
        return new AppointmentDTO
        {
            Id = appointment.Id,
            AppointmentDate = appointment.AppointmentDate,
            Note = appointment.Note
        };
    }
    public static Appointment ToAppointment(this CreateAppointmentDTO createAppointmentDTO)
    {
        return new Appointment
        {
            AppointmentDate = createAppointmentDTO.AppointmentDate,
            Note = createAppointmentDTO.Note,
            DoctorId = createAppointmentDTO.DoctorId,
            PatientId = createAppointmentDTO.PatientId,
            CategoryId = createAppointmentDTO.CategoryId,
            StatusId = createAppointmentDTO.StatusId,
            ClinicId = createAppointmentDTO.ClinicId
        };
    }

}