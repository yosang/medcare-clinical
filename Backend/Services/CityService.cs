using Context;
using DTOS;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;
public class CityService
{
    public readonly DatabaseContext _ctx;

    public CityService(DatabaseContext context)
    {
        _ctx = context;
    }

    public async Task<IEnumerable<CityWithDetailsDTO>> GetCities()
    {

        var cities = await _ctx.Cities.AsNoTracking()
                            .Include(cli => cli.Clinics)
                            .Select(city => new CityWithDetailsDTO
                            {
                                Id = city.Id,
                                Name = city.Name,
                                Clinics = city.Clinics!.Select(clinic => new ClinicDTO
                                {
                                    Id = clinic.Id,
                                    Name = clinic.Name,
                                    Phone = clinic.Phone,
                                    Email = clinic.Email,
                                    Address = clinic.Address,
                                    PostalCode = clinic.PostalCode,
                                })
                            }).ToListAsync();

        return cities;
    }

    public async Task<CityWithDetailsDTO?> GetCity(int id)
    {
        var city = await _ctx.Cities.AsNoTracking()
                                    .Where(city => city.Id == id)
                                    .Include(city => city.Clinics)
                                    .Select(city => new CityWithDetailsDTO
                                    {
                                        Id = city.Id,
                                        Name = city.Name,
                                        Clinics = city.Clinics!.Select(clinic => new ClinicDTO
                                        {
                                            Id = clinic.Id,
                                            Name = clinic.Name,
                                            Phone = clinic.Phone,
                                            Email = clinic.Email,
                                            Address = clinic.Address,
                                            PostalCode = clinic.PostalCode,
                                        })
                                    }).FirstOrDefaultAsync();
        return city;
    }

    public async Task<IEnumerable<ClinicDTO>> GetClinics(int id)
    {
        var clinics = await _ctx.Clinics.AsNoTracking()
                                        .Where(clinic => clinic.CityId == id)
                                        .Select(clinic => new ClinicDTO
                                        {
                                            Id = clinic.Id,
                                            Name = clinic.Name,
                                            Phone = clinic.Phone,
                                            Email = clinic.Email,
                                            Address = clinic.Address,
                                            PostalCode = clinic.PostalCode,
                                        })
                                        .ToListAsync();
        return clinics;
    }

    public async Task<City> CreateCity(CreateCityDTO city)
    {
        var newCity = new City
        {
            Name = city.Name
        };

        _ctx.Cities.Add(newCity);

        try
        {
            await _ctx.SaveChangesAsync();
            return newCity;
        } catch(DbUpdateException ex)
        {
            Console.WriteLine("Database operation failed with message: " + ex.Message);
            throw;
        } catch(Exception ex)
        {
            Console.WriteLine("Something went wrong: " + ex.Message);
            throw;
        }
    }

    public async Task<CityDTO?> UpdateCity(int id, UpdateCityDTO city)
    {
        var existingCity = await _ctx.Cities.FindAsync(id);
        if(existingCity == null) return null;

        existingCity.Name = city.Name;

        try
        {
            await _ctx.SaveChangesAsync();
            return new CityDTO
            {
                Id = existingCity.Id,
                Name = existingCity.Name
            };
         } catch(DbUpdateException ex)
        {
            Console.WriteLine("Database operation failed with message: " + ex.Message);
            throw;
        } catch(Exception ex)
        {
            Console.WriteLine("Something went wrong: " + ex.Message);
            throw;
        }
    }

    public async Task<bool> DeleteCity(int id)
    {
        var city = await _ctx.Cities.FindAsync(id);
        if(city == null) return false;

        _ctx.Remove(city);

        try
        {
            await _ctx.SaveChangesAsync();
            return true;
         } catch(DbUpdateException ex)
        {
            Console.WriteLine("Database operation failed with message: " + ex.Message);
            throw;
        } catch(Exception ex)
        {
            Console.WriteLine("Something went wrong: " + ex.Message);
            throw;
        }
    }
}