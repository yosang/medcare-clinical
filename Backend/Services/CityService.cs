using Data.Context;
using DTOS;
using Extensions.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Services;
public class CityService
{
    private readonly DatabaseContext _ctx;

    public CityService(DatabaseContext context)
    {
        _ctx = context;
    }

    /// <summary> Reads cities from the database without tracking for reduced performance overhead </summary>
    /// <returns>List of cities</returns>
    public async Task<IEnumerable<CityWithDetailsDTO>> GetCities()
    {

        var cities = await _ctx.Cities.AsNoTracking()
                                      .Include(c => c.Clinics)
                                      .Select(city => city.ToCityWithDetailsDTO())
                                      .ToListAsync();

        return cities;
    }

    /// <summary> Reads a single city from the database without tracking for reduced performance overhead </summary>
    /// <param name="id"></param>
    /// <returns>A single city</returns>
    public async Task<CityWithDetailsDTO?> GetCity(int id)
    {
        var city = await _ctx.Cities.AsNoTracking()
                                    .Where(city => city.Id == id)
                                    .Include(c => c.Clinics)
                                    .Select(city => city.ToCityWithDetailsDTO())
                                    .FirstOrDefaultAsync();
        return city;
    }

    /// <summary> Writes a new city entity to the database </summary>
    /// <param name="dto"></param>
    /// <returns>Created city</returns>
    public async Task<CityDTO> CreateCity(CreateCityDTO dto)
    {
        var newCity = dto.ToCity();

        _ctx.Cities.Add(newCity);

        await _ctx.SaveChangesAsync();
        return newCity.ToCityDTO();;
    }

    /// <summary> Updates an existing city </summary>
    /// <param name="id"></param>
    /// <param name="dto"></param>
    /// <returns>Updated city</returns>
    public async Task<CityDTO?> UpdateCity(int id, UpdateCityDTO dto)
    {
        var existing = await _ctx.Cities.FindAsync(id);
        if(existing == null) return null;

        existing.UpdateWith(dto);

        await _ctx.SaveChangesAsync();

        return existing.ToCityDTO();
    }

    /// <summary> Deletes an existing city </summary>
    /// <param name="id"></param>
    /// <returns>Boolean representation of deletion result</returns>
    public async Task<bool> DeleteCity(int id)
    {
        var existing = await _ctx.Cities.FindAsync(id);
        if(existing == null) return false;

        _ctx.Cities.Remove(existing);

        await _ctx.SaveChangesAsync();
        
        return true;
    }
}