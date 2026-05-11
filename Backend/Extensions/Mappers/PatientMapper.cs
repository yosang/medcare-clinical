using DTOS;
using Models;

namespace Extensions.Mappers;

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

    public static Patient ToPatient(this PatientDTO dto)
    {
        return new Patient
        {
            Id = dto.Id,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Phone = dto.Phone,
            Email = dto.Email,
            DateOfBirth = dto.DateOfBirth,
            NationalIdentityNumber = dto.NationalIdentityNumber,
            IsRegistered = dto.IsRegistered
        };
    }

    public static PatientWithDetailsDTO ToPatientWithDetailsDTO(this Patient patient)
    {
        return new PatientWithDetailsDTO
        {
            Id = patient.Id,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            Phone = patient.Phone,
            Email = patient.Email,
            DateOfBirth = patient.DateOfBirth,
            NationalIdentityNumber = patient.NationalIdentityNumber,
            IsRegistered = patient.IsRegistered,
            Appointments = patient.Appointments?.Select(appointment => appointment.ToAppointmentDTO())
        };
    }
}