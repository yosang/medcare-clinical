using DTOS;
using Microsoft.AspNetCore.Identity;
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
            DateOfBirth = patient.DateOfBirth,
            Phone = patient.Phone,
            Email = patient.Email,
            NationalIdentityNumber = patient.NationalIdentityNumber,
            IsRegistered = patient.IsRegistered
        };
    }
    public static GuestPatientDTO ToGuestPatientDTO(this Patient patient)
    {
        return new GuestPatientDTO
        {
            Id = patient.Id,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            DateOfBirth = patient.DateOfBirth,
            Phone = patient.Phone,
            Email = null,
            NationalIdentityNumber = null,
            IsRegistered = false
        };
    }

    public static Patient ToPatient(this CreateGuestPatientDTO dto)
    {
        return new Patient
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            DateOfBirth = dto.DateOfBirth,
            Phone = dto.Phone
        };
    }
    public static Patient ToPatient(this RegisterPatientDTO dto)
    {
        return new Patient
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            DateOfBirth = dto.DateOfBirth,
            Phone = dto.Phone,
            Email = dto.Email,
            NationalIdentityNumber = dto.NationalIdentityNumber,
        };
    }

    public static PatientWithDetailsDTO ToPatientWithDetailsDTO(this Patient patient)
    {
        return new PatientWithDetailsDTO
        {
            Id = patient.Id,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            DateOfBirth = patient.DateOfBirth,
            Phone = patient.Phone,
            Email = patient.Email,
            NationalIdentityNumber = patient.NationalIdentityNumber,
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
        if(!string.IsNullOrWhiteSpace(dto.Password)) existing.PasswordHash = new PasswordHasher<object>().HashPassword(null!, dto.Password);
    }
}