using Context;
using DTOS;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;
public class CityService
{
    public DatabaseContext _ctx { get; set; }

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
}