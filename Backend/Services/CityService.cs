using Context;
using DTOS;
using Extensions.Mappers;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;
public class CityService
{
    private readonly DatabaseContext _ctx;

    public CityService(DatabaseContext context)
    {
        _ctx = context;
    }

    public async Task<IEnumerable<CityWithDetailsDTO>> GetCities()
    {

        var cities = await _ctx.Cities.AsNoTracking()
                                      .Include(c => c.Clinics)
                                      .Select(city => city.ToCityWithDetailsDTO())
                                      .ToListAsync();

        return cities;
    }

    public async Task<CityWithDetailsDTO?> GetCity(int id)
    {
        var city = await _ctx.Cities.AsNoTracking()
                                    .Where(city => city.Id == id)
                                    .Include(c => c.Clinics)
                                    .Select(city => city.ToCityWithDetailsDTO())
                                    .FirstOrDefaultAsync();
        return city;
    }

    public async Task<IEnumerable<ClinicDTO>> GetClinics(int id)
    {
        var clinics = await _ctx.Clinics.AsNoTracking()
                                        .Where(clinic => clinic.CityId == id)
                                        .Select(clinic => clinic.ToClinicDTO())
                                        .ToListAsync();
        return clinics;
    }

    public async Task<CityDTO> CreateCity(CreateCityDTO dto)
    {
        var newCity = dto.ToCity();

        _ctx.Cities.Add(newCity);

        await _ctx.SaveChangesAsync();
        return newCity.ToCityDTO();;
    }

    public async Task<CityDTO?> UpdateCity(int id, UpdateCityDTO dto)
    {
        var existing = await _ctx.Cities.FindAsync(id);
        if(existing == null) return null;

        existing.Name = dto.Name;

        await _ctx.SaveChangesAsync();

        return existing.ToCityDTO();
    }

    public async Task<bool> DeleteCity(int id)
    {
        var existing = await _ctx.Cities.FindAsync(id);
        if(existing == null) return false;

        _ctx.Cities.Remove(existing);

        await _ctx.SaveChangesAsync();
        
        return true;
    }
}