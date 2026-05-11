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

    public static Doctor ToDoctor(this CreateDoctorDTO dto)
    {
        return new Doctor
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
        };
    }
}