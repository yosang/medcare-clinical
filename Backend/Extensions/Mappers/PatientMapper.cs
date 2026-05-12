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

    public static void UpdateWith(this Patient existing, UpdatePatientDTO dto)
    {
        if(!string.IsNullOrWhiteSpace(dto.FirstName)) existing.FirstName = dto.FirstName;
        if(!string.IsNullOrWhiteSpace(dto.LastName)) existing.LastName = dto.LastName;
        if(!string.IsNullOrWhiteSpace(dto.Phone)) existing.Phone = dto.Phone;
        if(!string.IsNullOrWhiteSpace(dto.Email)) existing.Email = dto.Email;
        if(dto.DateOfBirth.HasValue) existing.DateOfBirth = dto.DateOfBirth.Value;
        if(!string.IsNullOrWhiteSpace(dto.NationalIdentityNumber)) existing.NationalIdentityNumber = dto.NationalIdentityNumber;
        if(!string.IsNullOrWhiteSpace(dto.PasswordHash)) existing.PasswordHash = dto.PasswordHash;
        if(dto.IsRegistered.HasValue) existing.IsRegistered = dto.IsRegistered.Value;
    }
}