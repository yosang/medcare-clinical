using Context;
using DTOS;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;
public class DoctorService
{
    private readonly DatabaseContext _ctx;

    public DoctorService(DatabaseContext context)
    {
        _ctx = context;
    }

    public async Task<IEnumerable<DoctorWithDetailsDTO>> GetDoctors()
    {
        var doctors = await _ctx.Doctors.AsNoTracking()
                                        .Select(doctor => new DoctorWithDetailsDTO
                                        {
                                            Id = doctor.Id,
                                            FirstName = doctor.FirstName,
                                            LastName = doctor.LastName,
                                            Email = doctor.Email,
                                            Specialty = new SpecialtyDTO { Id = doctor.SpecialtyId, Name = doctor.Specialty!.Name},
                                            Clinic = new ClinicDTO { 
                                                Id = doctor.ClinicId, 
                                                Name = doctor.Clinic!.Name,
                                                Phone = doctor.Clinic.Phone,
                                                Email = doctor.Clinic.Email,
                                                Address = doctor.Clinic.Address,
                                                PostalCode = doctor.Clinic.PostalCode
                                            },
                                            Appointments = doctor.Appointments!.Select(appointment => new AppointmentDTO
                                            {
                                                Id = appointment.Id,
                                                AppointmentDate = appointment.AppointmentDate,
                                                Note = appointment.Note
                                            })
                                        }).ToListAsync();

        return doctors;
    }

    public async Task<DoctorWithDetailsDTO?> GetDoctor(int id)
    {
        var doctor = await _ctx.Doctors.AsNoTracking()
                                        .Where(doctor => doctor.Id == id)
                                        .Select(doctor => new DoctorWithDetailsDTO
                                        {
                                            Id = doctor.Id,
                                            FirstName = doctor.FirstName,
                                            LastName = doctor.LastName,
                                            Email = doctor.Email,
                                            Specialty = new SpecialtyDTO { Id = doctor.SpecialtyId, Name = doctor.Specialty!.Name},
                                            Clinic = new ClinicDTO { 
                                                Id = doctor.ClinicId, 
                                                Name = doctor.Clinic!.Name,
                                                Phone = doctor.Clinic.Phone,
                                                Email = doctor.Clinic.Email,
                                                Address = doctor.Clinic.Address,
                                                PostalCode = doctor.Clinic.PostalCode
                                            },
                                            Appointments = doctor.Appointments!.Select(appointment => new AppointmentDTO
                                            {
                                                Id = appointment.Id,
                                                AppointmentDate = appointment.AppointmentDate,
                                                Note = appointment.Note
                                            })                                            
                                        }).FirstOrDefaultAsync();
        return doctor;
    }

    public async Task<IEnumerable<AppointmentDTO>> GetAppointments(int id)
    {
        var appointments = await _ctx.Appointments.AsNoTracking()
                                                  .Where(appointment => appointment.DoctorId == id)
                                                  .Select(appointment => new AppointmentDTO
                                                  {
                                                      Id = appointment.Id,
                                                      AppointmentDate = appointment.AppointmentDate,
                                                      Note = appointment.Note
                                                  })
                                                  .ToListAsync();
        return appointments;
    }

    public async Task<DoctorDTO> CreateDoctor(CreateDoctorDTO doctor)
    {
        var newDoctor = new Doctor
        {
            FirstName = doctor.FirstName,
            LastName = doctor.LastName,
            Email = doctor.Email,
            SpecialtyId = doctor.SpecialtyId,
            ClinicId = doctor.ClinicId   
        };

        _ctx.Doctors.Add(newDoctor);

        await _ctx.SaveChangesAsync();
        
        return new DoctorDTO
        {
            Id = newDoctor.Id,
            FirstName = newDoctor.FirstName,
            LastName = newDoctor.LastName,
            Email = newDoctor.Email,
            SpecialtyId = newDoctor.SpecialtyId,
            ClinicId = newDoctor.ClinicId   
        };
    }

    public async Task<DoctorDTO?> UpdateDoctor(int id, UpdateDoctorDTO doctor)
    {
        var existingDoctor = await _ctx.Doctors.FindAsync(id);
        if(existingDoctor == null) return null;

        existingDoctor.FirstName = doctor.FirstName;
        existingDoctor.LastName = doctor.LastName;
        existingDoctor.Email = doctor.Email;
        existingDoctor.SpecialtyId = doctor.SpecialtyId;
        existingDoctor.ClinicId = doctor.ClinicId;

        await _ctx.SaveChangesAsync();

        return new DoctorDTO
        {
            Id = existingDoctor.Id,
            FirstName = existingDoctor.FirstName,
            LastName = existingDoctor.LastName,
            Email = existingDoctor.Email,
            SpecialtyId = existingDoctor.SpecialtyId,
            ClinicId = existingDoctor.ClinicId
        };
    }

    public async Task<bool> DeleteDoctor(int id)
    {
        var doctor = await _ctx.Doctors.FindAsync(id);
        if(doctor == null) return false;

        _ctx.Doctors.Remove(doctor);

        await _ctx.SaveChangesAsync();
        
        return true;
    }
}