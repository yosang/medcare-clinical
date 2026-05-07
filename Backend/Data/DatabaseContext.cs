using Microsoft.EntityFrameworkCore;
using Models;

namespace Context;

public class DatabaseContext: DbContext
{
    public DbSet<City> Cities { get; set; }
    public DbSet<Clinic> Clinics { get; set; }
    public DbSet<Specialty> Specialties { get; set; }
    public DbSet<Doctor> Doctors { get; set;}
    public DbSet<Category> Categories { get; set; }
    public DbSet<Status> Statuses { get; set; }
    public DbSet<Appointment> Appointments { get; set;}
    public DbSet<Patient> Patients { get; set; }

    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Clinic>()
                    .HasOne<City>(ci => ci.City) // A clinic belongs to one city 
                    .WithMany(cli => cli.Clinics) // while cities can have many clinics
                    .HasForeignKey(ci => ci.CityId) // The foreign key referencing to cities on the clinic model
                    .OnDelete(DeleteBehavior.Restrict); // We want to restrict records in the City table from being deleted, if a parent table (Clinic) has a reference to it
    }
}