using DTOS;
using Models;

namespace Extensions.Mappers;
public static class ClinicMapper
{
    public static ClinicDTO ToClinicDTO(this Clinic clinic)
    {
        return new ClinicDTO
        {
            Id = clinic.Id,
            Name = clinic.Name,
            Phone = clinic.Phone,
            Email = clinic.Email,
            Address = clinic.Address,
            PostalCode = clinic.PostalCode,
        };
    }   

    public static ClinicWithDetailsDTO ToClinicWithDetailsDTO(this Clinic clinic)
    {
        return new ClinicWithDetailsDTO
        {
            Id = clinic.Id,
            Name = clinic.Name,
            Phone = clinic.Phone,
            Email = clinic.Email,
            Address = clinic.Address,
            PostalCode = clinic.PostalCode,
            City = clinic.City?.ToCityDTO(),
            Appointments = clinic.Appointments?.Select(appointment => appointment.ToAppointmentDTO())
        };
    }

    public static Clinic ToClinic(this CreateClinicDTO dto)
    {
        return new Clinic
        {
            Name = dto.Name,
            Phone = dto.Phone,
            Email = dto.Email,
            Address = dto.Address,
            PostalCode = dto.PostalCode,
            CityId = dto.CityId
        };
    }   

    public static void UpdateWith(this Clinic clinic, UpdateClinicDTO dto)
    {
        if(!string.IsNullOrWhiteSpace(dto.Name)) clinic.Name = dto.Name;
        if(!string.IsNullOrWhiteSpace(dto.Phone)) clinic.Phone = dto.Phone;
        if(!string.IsNullOrWhiteSpace(dto.Email)) clinic.Email = dto.Email;
        if(!string.IsNullOrWhiteSpace(dto.Address)) clinic.Address = dto.Address;
        if(!string.IsNullOrWhiteSpace(dto.PostalCode)) clinic.PostalCode = dto.PostalCode;
        if(dto.CityId.HasValue) clinic.CityId = dto.CityId.Value;
    }
}