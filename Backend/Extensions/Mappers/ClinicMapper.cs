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
            PostalCode = clinic.PostalCode
        };
    }   
}