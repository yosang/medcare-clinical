using DTOS;
using Models;

namespace Services.Mappers;

public static class PatientMapper
{
    public static PatientDTO ToPatientDTO(this Patient patient)
    {
        return new PatientDTO
        {
          Id = patient.Id,
          FirstName = patient.FirstName,
          LastName = patient.LastName,
          Phone = patient.Phone,
          Email = patient.Email,
          DateOfBirth = patient.DateOfBirth,
          NationalIdentityNumber = patient.NationalIdentityNumber,
          IsRegistered = patient.IsRegistered
        };
    }
}