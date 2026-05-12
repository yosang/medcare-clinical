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
}