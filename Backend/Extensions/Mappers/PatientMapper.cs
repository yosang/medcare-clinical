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
            PasswordHash = patient.PasswordHash,
            IsRegistered = patient.IsRegistered
        };
    }

    public static Patient ToPatient(this CreatePatientDTO dto)
    {
        return new Patient
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Phone = dto.Phone,
            Email = dto.Email,
            DateOfBirth = dto.DateOfBirth,
            NationalIdentityNumber = dto.NationalIdentityNumber,
            PasswordHash = dto.PasswordHash,
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
            PasswordHash = patient.PasswordHash,
            IsRegistered = patient.IsRegistered,
            Appointments = patient.Appointments?.Select(appointment => appointment.ToAppointmentDTO())
        };
    }
}