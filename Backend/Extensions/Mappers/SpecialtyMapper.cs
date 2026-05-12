using DTOS;
using Models;

namespace Extensions.Mappers;
public static class SpecialtyMapper
{
    public static SpecialtyDTO ToSpecialtyDTO(this Specialty specialty)
    {
        return new SpecialtyDTO
        {
            Id = specialty.Id,
            Name = specialty.Name
        };
    }
    public static SpecialtyWithDetailsDTO ToSpecialtyWithDetailsDTO(this Specialty specialty)
    {
        return new SpecialtyWithDetailsDTO
        {
            Id = specialty.Id,
            Name = specialty.Name,
            Doctors = specialty.Doctors!.Select(doctor => doctor.ToDoctorDTO())
        };
    }

    public static Specialty ToSpecialty(this CreateSpecialtyDTO dto)
    {
        return new Specialty
        {
            Name = dto.Name
        };
    }

    public static void UpdateWith(this Specialty existing, UpdateSpecialtyDTO dto)
    {
        if(!string.IsNullOrWhiteSpace(dto.Name)) existing.Name = dto.Name;
    }
}