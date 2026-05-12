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

    public static void UpdateWith(this Appointment existing, UpdateAppointmentDTO dto)
    {
        if(dto.AppointmentDate.HasValue) existing.AppointmentDate = dto.AppointmentDate.Value;
        if(dto.Note != null) existing.Note = dto.Note;
        if(dto.PatientId.HasValue) existing.PatientId = dto.PatientId.Value;
        if(dto.DoctorId.HasValue) existing.DoctorId = dto.DoctorId.Value;
        if(dto.ClinicId.HasValue) existing.ClinicId = dto.ClinicId.Value;
        if(dto.CategoryId.HasValue) existing.CategoryId = dto.CategoryId.Value;
        if(dto.StatusId.HasValue) existing.StatusId = dto.StatusId.Value;
    } 
}