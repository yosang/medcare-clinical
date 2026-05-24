using Microsoft.EntityFrameworkCore;
using Models;
using Data.Seeds;

namespace Data.Context;

public class DatabaseContext : DbContext
{
    public DbSet<City> Cities { get; set; }
    public DbSet<Clinic> Clinics { get; set; }
    public DbSet<Specialty> Specialties { get; set; }
    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Status> Statuses { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Patient> Patients { get; set; }

    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Constraints
        modelBuilder.Entity<City>().HasIndex(c => c.Name).IsUnique();
        
        modelBuilder.Entity<Clinic>().HasIndex(c => c.Name).IsUnique();

        modelBuilder.Entity<Specialty>().HasIndex(c => c.Name).IsUnique();
        modelBuilder.Entity<Doctor>().HasIndex(c => new { c.FirstName, c.LastName}).IsUnique();

        modelBuilder.Entity<Category>().HasIndex(c => c.Name).IsUnique();
        modelBuilder.Entity<Status>().HasIndex(c => c.Name).IsUnique();

        // Since we are using Email as an auth identifier, it must be unique
        modelBuilder.Entity<Patient>().HasIndex(c => c.Email).IsUnique();
        
        // In most systems, a personal Id is also unique
        modelBuilder.Entity<Patient>().HasIndex(c => c.NationalIdentityNumber).IsUnique();

        // Relationships
        modelBuilder.Entity<Clinic>()
                    .HasOne<City>(ci => ci.City)
                    .WithMany(cli => cli.Clinics)
                    .HasForeignKey(ci => ci.CityId)
                    .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Doctor>()
                    .HasOne<Specialty>(sp => sp.Specialty)
                    .WithMany(d => d.Doctors)
                    .HasForeignKey(d => d.SpecialtyId)
                    .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Doctor>()
                    .HasOne<Clinic>(ci => ci.Clinic)
                    .WithMany(d => d.Doctors)
                    .HasForeignKey(ci => ci.ClinicId)
                    .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Appointment>()
                    .HasOne<Category>(ca => ca.Category)
                    .WithMany(ap => ap.Appointments)
                    .HasForeignKey(ca => ca.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Appointment>()
                    .HasOne<Status>(st => st.Status)
                    .WithMany(ap => ap.Appointments)
                    .HasForeignKey(st => st.StatusId)
                    .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Appointment>()
                    .HasOne<Doctor>(p => p.Doctor)
                    .WithMany(ap => ap.Appointments)
                    .HasForeignKey(ap => ap.DoctorId)
                    .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Appointment>()
                    .HasOne<Patient>(p => p.Patient)
                    .WithMany(ap => ap.Appointments)
                    .HasForeignKey(ap => ap.PatientId)
                    .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Appointment>()
                    .HasOne<Clinic>(p => p.Clinic)
                    .WithMany(ap => ap.Appointments)
                    .HasForeignKey(ap => ap.ClinicId)
                    .OnDelete(DeleteBehavior.Restrict);

        // Seeds
        modelBuilder.Entity<City>().HasData(SeedsData.Cities);
        modelBuilder.Entity<Clinic>().HasData(SeedsData.Clinics);

        modelBuilder.Entity<Specialty>().HasData(SeedsData.Specialties);
        modelBuilder.Entity<Doctor>().HasData(SeedsData.Doctors);

        modelBuilder.Entity<Category>().HasData(SeedsData.Categories);
        modelBuilder.Entity<Status>().HasData(SeedsData.Statuses);

        modelBuilder.Entity<Patient>().HasData(SeedsData.Patients);
        modelBuilder.Entity<Appointment>().HasData(SeedsData.Appointments);
    }
}