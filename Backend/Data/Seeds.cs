using Models;

namespace Data.Seeds;

public static class SeedsData
{
    public static List<Role> Roles { get; } = new List<Role>
    {
        new Role { Id = 1, Name = "Patient"},
        new Role { Id = 2, Name = "Admin"}
    };
    
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
        new Doctor { Id = 1, FirstName = "Mathias", LastName = "Bekkemellem", Email = "mb@klinikken.no", SpecialtyId = 1, ClinicId = 1, Image = "https://i.imgur.com/CeGHXlw.jpeg"},
        new Doctor { Id = 2, FirstName = "Carina", LastName = "Johansen", Email = "cj@klinikken.no", SpecialtyId = 2, ClinicId = 2, Image = "https://i.imgur.com/3WobpO1.jpeg"},
        new Doctor { Id = 3, FirstName = "John", LastName = "Carlsen", Email = "jc@klinikken.no", SpecialtyId = 1, ClinicId = 3, Image = "https://i.imgur.com/sPiOLsv.jpeg"},
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

    public static List<Patient> Patients { get; } = new List<Patient>()
    {
        new Patient { Id = 1, FirstName = "Admin", LastName = "Admin", Phone = "99999999", Email = "admin@dev.com", DateOfBirth = DateTime.MinValue, NationalIdentityNumber = "99999999999", PasswordHash = "AQAAAAIAAYagAAAAEBoc7/xHyQ88YJ7b5/fvDDkFTAH6GmsiH03ouiYgQWUEx1zu7NsSDmTeHrcdsHHyxg==", IsRegistered = true, RoleId = 2},
        new Patient { Id = 2, FirstName = "Ola", LastName = "Nordman", Phone = "99999999", Email = "user@dev.com", DateOfBirth = DateTime.MinValue, NationalIdentityNumber = "88888888888", PasswordHash = "AQAAAAIAAYagAAAAEBoc7/xHyQ88YJ7b5/fvDDkFTAH6GmsiH03ouiYgQWUEx1zu7NsSDmTeHrcdsHHyxg==", IsRegistered = true, RoleId = 1}
    };

    public static List<Appointment> Appointments { get; } = new()
    {
        new Appointment { Id = 1, AppointmentDate = new DateTime(2026, 7, 1, 8, 30, 0), Duration = 30, CategoryId = 1, DoctorId = 1, ClinicId = 1, PatientId = 2, StatusId = 2, Note = "Mild headaches for the past two weeks." },
        new Appointment { Id = 2, AppointmentDate = new DateTime(2026, 7, 1, 9, 15, 0), Duration = 60, CategoryId = 2, DoctorId = 1, ClinicId = 1, PatientId = 2, StatusId = 1, Note = "Follow-up consultation after blood pressure medication adjustment." },
        new Appointment { Id = 3, AppointmentDate = new DateTime(2026, 7, 2, 10, 0, 0), Duration = 30, CategoryId = 3, DoctorId = 2, ClinicId = 2, PatientId = 2, StatusId = 1 },
        new Appointment { Id = 4, AppointmentDate = new DateTime(2026, 7, 2, 11, 0, 0), Duration = 30, CategoryId = 4, DoctorId = 2, ClinicId = 2, PatientId = 2, StatusId = 1 },
        new Appointment { Id = 5, AppointmentDate = new DateTime(2026, 7, 3, 14, 0, 0), Duration = 60, CategoryId = 5, DoctorId = 3, ClinicId = 3, PatientId = 2, StatusId = 3 },
        new Appointment { Id = 6, AppointmentDate = new DateTime(2026, 7, 4, 8, 30, 0), Duration = 30, CategoryId = 1, DoctorId = 1, ClinicId = 1, PatientId = 2, StatusId = 1 },
        new Appointment { Id = 7, AppointmentDate = new DateTime(2026, 7, 5, 13, 0, 0), Duration = 60, CategoryId = 2, DoctorId = 2, ClinicId = 2, PatientId = 2, StatusId = 2 },
        new Appointment { Id = 8, AppointmentDate = new DateTime(2026, 7, 6, 9, 0, 0), Duration = 30, CategoryId = 3, DoctorId = 3, ClinicId = 3, PatientId = 2, StatusId = 1 },
        new Appointment { Id = 9, AppointmentDate = new DateTime(2026, 7, 7, 15, 0, 0), Duration = 30, CategoryId = 4, DoctorId = 1, ClinicId = 1, PatientId = 2, StatusId = 3 },
        new Appointment { Id = 10, AppointmentDate = new DateTime(2026, 7, 8, 10, 30, 0), Duration = 60, CategoryId = 5, DoctorId = 2, ClinicId = 2, PatientId = 2, StatusId = 2 }
    };
    
}