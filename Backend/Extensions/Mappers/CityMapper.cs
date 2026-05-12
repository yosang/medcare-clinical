using DTOS;
using Models;

namespace Extensions.Mappers;
public static class CityMapper
{
    public static CityWithDetailsDTO ToCityWithDetailsDTO(this City city)
    {
        return new CityWithDetailsDTO
        {
            Id = city.Id,
            Name = city.Name,
            Clinics = city.Clinics?.Select(clinic => clinic.ToClinicDTO())
        };
    }

    public static CityDTO ToCityDTO(this City city)
    {
        return new CityDTO
        {
            Id = city.Id,
            Name = city.Name
        };
    }

    public static City ToCity(this CreateCityDTO dto)
    {
        return new City
        {
            Name = dto.Name
        };
    }

    public static void UpdateWith(this City existing, UpdateCityDTO dto)
    {
        if(!string.IsNullOrWhiteSpace(dto.Name)) existing.Name = dto.Name;
    }
}