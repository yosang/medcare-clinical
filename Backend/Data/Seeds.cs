using Models;

namespace Data.Seeds;

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

    public static List<Doctor> Doctors { get; } = new List<Doctor>()
    {
        new Doctor { Id = 1, FirstName = "Mathias", LastName = "Bekkemellem", Email = "mb@klinikken.no", SpecialtyId = 1, ClinicId = 1},
        new Doctor { Id = 2, FirstName = "Carina", LastName = "Johansen", Email = "cj@klinikken.no", SpecialtyId = 2, ClinicId = 2},
        new Doctor { Id = 3, FirstName = "John", LastName = "Carlsen", Email = "jc@klinikken.no", SpecialtyId = 1, ClinicId = 3},
    };

    public static List<Category> Categories { get; } = new List<Category>()
    {
        new Category { Id = 1, Name = "General Health Consultation"},
        new Category { Id = 2, Name = "Follow-up Consultation"},
        new Category { Id = 3, Name = "Vaccination"},
        new Category { Id = 4, Name = "Medicine Prescription"},
        new Category { Id = 5, Name = "Emergency"}
    };

    public static List<Status> Statuses { get; } = new List<Status>()
    {
        new Status { Id = 1, Name = "Pending"},
        new Status { Id = 2, Name = "Completed"},
        new Status { Id = 3, Name = "Cancelled"}
    };

    // Mixed list of patients, registered and guests
    public static List<Patient> Patients { get; } = new List<Patient>()
    {
        new Patient { Id = 1, FirstName = "Mark", LastName = "Johanson", Phone = "24242424", Email = "mark.j@mail.com", DateOfBirth = new DateTime(1992, 05, 24), NationalIdentityNumber = "524231231", PasswordHash = "FAKEHASH", IsRegistered = true},
        new Patient { Id = 2, FirstName = "Tobias", LastName = "Karevik", Phone = "555555", Email = "tobben@mail.com", DateOfBirth = new DateTime(1991, 02, 13), NationalIdentityNumber = "66666666", PasswordHash = "FAKEHASH", IsRegistered = true},
        new Patient { Id = 3, FirstName = "Daniela", LastName = "Thomson", Phone = "333222333", Email = "danny@mail.com", DateOfBirth = new DateTime(1982, 08, 04), NationalIdentityNumber = "878787878", PasswordHash = "FAKEHASH", IsRegistered = true},
        new Patient { Id = 4, FirstName = "Carlos", LastName = "Rodriguez", Phone = "777788877", Email = "carlos@mail.com", DateOfBirth = new DateTime(1986, 10, 07), NationalIdentityNumber = null, PasswordHash = null, IsRegistered = false},
        new Patient { Id = 5, FirstName = "Jan", LastName = "Dan", Phone = "222777722", Email = "jandan@mail.com", DateOfBirth = new DateTime(1984, 03, 22), NationalIdentityNumber = null, PasswordHash = null, IsRegistered = false}
    };

    public static List<Appointment> Appointments { get; } = new List<Appointment>()
    {
        new Appointment { Id = 1, AppointmentDate = new DateTime(2026, 05, 24, 08, 15, 0), Duration = 30, Note = null, PatientId = 1, DoctorId = 1, ClinicId = 1, CategoryId = 1, StatusId = 1 },
        new Appointment { Id = 2, AppointmentDate = new DateTime(2026, 05, 24, 10, 30, 0), Duration = 30, Note = null, PatientId = 2, DoctorId = 1, ClinicId = 1, CategoryId = 1, StatusId = 1 },
        new Appointment { Id = 3, AppointmentDate = new DateTime(2026, 05, 24, 12, 30, 0), Duration = 30, Note = null, PatientId = 3, DoctorId = 1, ClinicId = 1, CategoryId = 1, StatusId = 1 }
    };
}