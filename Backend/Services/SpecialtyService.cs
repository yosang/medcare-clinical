using Context;
using DTOS;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;
public class SpecialtyService
{
    private readonly DatabaseContext _ctx;

    public SpecialtyService(DatabaseContext context)
    {
        _ctx = context;
    }

    public async Task<IEnumerable<SpecialtyWithDetailsDTO>> GetSpecialties()
    {

        var specialties = await _ctx.Specialties.AsNoTracking()
                                                .Select(specialty => new SpecialtyWithDetailsDTO
                                                {
                                                    Id = specialty.Id,
                                                    Name = specialty.Name,
                                                    Doctors = specialty.Doctors!.Select(doctor => new DoctorDTO
                                                    {
                                                        Id = doctor.Id,
                                                        FirstName = doctor.FirstName,
                                                        LastName = doctor.LastName,
                                                        Email = doctor.Email,
                                                    })
                                                }).ToListAsync();

        return specialties;
    }

    public async Task<SpecialtyWithDetailsDTO?> GetSpecialty(int id)
    {
        var specialty = await _ctx.Specialties.AsNoTracking()
                                              .Where(specialty => specialty.Id == id)
                                              .Select(specialty => new SpecialtyWithDetailsDTO
                                              {
                                                  Id = specialty.Id,
                                                  Name = specialty.Name,
                                                  Doctors = specialty.Doctors!.Select(doctor => new DoctorDTO
                                                  {
                                                      Id = doctor.Id,
                                                      FirstName = doctor.FirstName,
                                                      LastName = doctor.LastName,
                                                      Email = doctor.Email,
                                                  })
                                              }).FirstOrDefaultAsync();
        return specialty;
    }

    public async Task<IEnumerable<DoctorDTO>> GetDoctors(int id)
    {
        var doctors = await _ctx.Doctors.AsNoTracking()
                                        .Where(doctor => doctor.SpecialtyId == id)
                                        .Select(doctor => new DoctorDTO
                                        {
                                            Id = doctor.Id,
                                            FirstName = doctor.FirstName,
                                            LastName = doctor.LastName,
                                            Email = doctor.Email,
                                        })
                                        .ToListAsync();
        return doctors;
    }

    public async Task<Specialty> CreateSpecialty(CreateSpecialtyDTO specialty)
    {
        var newSpecialty = new Specialty
        {
            Name = specialty.Name
        };

        _ctx.Specialties.Add(newSpecialty);

        await _ctx.SaveChangesAsync();
        return newSpecialty;
    }

    public async Task<SpecialtyDTO?> UpdateSpecialty(int id, UpdateSpecialtyDTO specialty)
    {
        var existingSpecialty = await _ctx.Specialties.FindAsync(id);
        if(existingSpecialty == null) return null;

        existingSpecialty.Name = specialty.Name;

        await _ctx.SaveChangesAsync();

        return new SpecialtyDTO
        {
            Id = existingSpecialty.Id,
            Name = existingSpecialty.Name
        };
    }

    public async Task<bool> DeleteSpecialty(int id)
    {
        var specialty = await _ctx.Specialties.FindAsync(id);
        if(specialty == null) return false;

        _ctx.Remove(specialty);

        await _ctx.SaveChangesAsync();
        
        return true;
    }
}