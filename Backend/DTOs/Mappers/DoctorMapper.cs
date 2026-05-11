using DTOS;
using Models;

namespace Services.Mappers;

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
}