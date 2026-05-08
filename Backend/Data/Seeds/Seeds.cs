using Models;

namespace Seeds;

public static class SeedsData
{
    public static List<City> Cities { get; } = new List<City>
    {
        new City { Id = 1, Name = "Oslo"},
        new City { Id = 2, Name = "Stavanger"},
        new City { Id = 3, Name = "Bergen"}
    };

    public static List<Clinic> Clinics { get; } = new List<Clinic>
    {
        new Clinic { Id = 1, Name = "Oslo Sentrum Klinikk", Phone = "222522222", Email = "oslo@klinikken.no", Address = "Karl Johans gate 8", PostalCode = "2232", CityId = 1},
        new Clinic { Id = 2, Name = "Stavanger Medisinske", Phone = "522223233", Email = "stavanger@klinikken.no", Address = "Maruksens gate 32", PostalCode = "5223", CityId = 2},
        new Clinic { Id = 3, Name = "Bergen Bryggen Klinikk", Phone = "22525252", Email = "bergen@klinikken.no", Address = "Brygga 9", PostalCode = "3232", CityId = 3}
    };

    public static List<Specialty> Specialties { get; } = new List<Specialty>
    {
        new Specialty { Id = 1, Name = "General Health" },
        new Specialty { Id = 2, Name = "Cardiologist" },
        new Specialty { Id = 3, Name = "Dermatologist" },
        new Specialty { Id = 4, Name = "Peditrician" }
    };
}