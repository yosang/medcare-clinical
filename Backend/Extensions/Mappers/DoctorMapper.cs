using DTOS;
using Models;

namespace Extensions.Mappers;

public static class DoctorMapper
{
    public static DoctorDTO ToDoctorDTO(this Doctor doctor)
    {
        return new DoctorDTO
        {
          Id = doctor.Id,
          FirstName = doctor.FirstName,
          LastName = doctor.LastName,
          Email = doctor.Email,
          SpecialtyId = doctor.SpecialtyId,
          ClinicId = doctor.ClinicId  
        };
    }
    public static DoctorWithDetailsDTO ToDoctorWithDetailsDTO(this Doctor doctor)
    {
        return new DoctorWithDetailsDTO
        {
          Id = doctor.Id,
          FirstName = doctor.FirstName,
          LastName = doctor.LastName,
          Email = doctor.Email,
          Specialty = doctor.Specialty?.ToSpecialtyDTO(),
          Clinic = doctor.Clinic?.ToClinicDTO(),
          Appointments = doctor.Appointments?.Select(appointment => appointment.ToAppointmentDTO())
        };
    }

    public static Doctor ToDoctor(this CreateDoctorDTO dto)
    {
        return new Doctor
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            SpecialtyId = dto.SpecialtyId,
            ClinicId = dto.ClinicId
        };
    }

    public static void UpdateWith(this Doctor existing, UpdateDoctorDTO dto)
    {
        if(!string.IsNullOrWhiteSpace(dto.FirstName)) existing.FirstName = dto.FirstName; 
        if(!string.IsNullOrWhiteSpace(dto.LastName)) existing.LastName = dto.LastName; 
        if(!string.IsNullOrWhiteSpace(dto.Email)) existing.Email = dto.Email; 
        if(dto.SpecialtyId.HasValue) existing.SpecialtyId = dto.SpecialtyId.Value;
        if(dto.ClinicId.HasValue) existing.ClinicId = dto.ClinicId.Value;
    }
}