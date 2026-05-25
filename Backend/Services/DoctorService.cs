using Data.Context;
using DTOS;
using Extensions.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Services;
public class DoctorService
{
    private readonly DatabaseContext _ctx;

    public DoctorService(DatabaseContext context)
    {
        _ctx = context;
    }

    /// <summary> Reads doctors from the database without tracking for reduced performance overhead </summary>
    /// <returns>List of doctors</returns>
    public async Task<IEnumerable<DoctorWithDetailsDTO>> GetDoctors()
    {
        var doctors = await _ctx.Doctors.AsNoTracking()
                                        .Include(d => d.Specialty)
                                        .Include(d => d.Clinic)
                                        .Include(d => d.Appointments)
                                        .Select(doctor => doctor.ToDoctorWithDetailsDTO())
                                        .ToListAsync();

        return doctors;
    }

    /// <summary> Reads a single doctor from the database without tracking for reduced performance overhead </summary>
    /// <param name="id"></param>
    /// <returns>A single doctor</returns>
    public async Task<DoctorWithDetailsDTO?> GetDoctor(int id)
    {
        var doctor = await _ctx.Doctors.AsNoTracking()
                                        .Where(doctor => doctor.Id == id)
                                        .Include(d => d.Specialty)
                                        .Include(d => d.Clinic)
                                        .Select(doctor => doctor.ToDoctorWithDetailsDTO())                                        
                                        .FirstOrDefaultAsync();
        return doctor;
    }

    /// <summary> Reads the database for a specific pattern matching including search term in either firstname or lastname </summary>
    /// <param name="name"></param>
    /// <returns>List of doctors found or empty</returns>
    public async Task<IEnumerable<DoctorWithDetailsDTO>> GetDoctors(string name)
    {
      var doctors = await _ctx.Doctors.AsNoTracking()
                                        .Where(d => EF.Functions.Like(d.FirstName, $"%{name}%") || EF.Functions.Like(d.LastName, $"%{name}%" ))
                                        .Include(d => d.Specialty)
                                        .Include(d => d.Clinic)
                                        .Select(doctor => doctor.ToDoctorWithDetailsDTO())
                                        .ToListAsync();
        return doctors;
    } 

    /// <summary> Writes a new doctor entity to the database </summary>
    /// <param name="dto"></param>
    /// <returns>Created doctor</returns>
    public async Task<DoctorDTO> CreateDoctor(CreateDoctorDTO dto)
    {
        var newDoctor = dto.ToDoctor();

        _ctx.Doctors.Add(newDoctor);

        await _ctx.SaveChangesAsync();
        
        return newDoctor.ToDoctorDTO();
    }

    /// <summary> Updates an existing doctor </summary>
    /// <param name="id"></param>
    /// <param name="dto"></param>
    /// <returns>Updated doctor</returns>
    public async Task<DoctorDTO?> UpdateDoctor(int id, UpdateDoctorDTO dto)
    {
        var existing = await _ctx.Doctors.FindAsync(id);
        if(existing == null) return null;

        existing.UpdateWith(dto);

        await _ctx.SaveChangesAsync();

        return existing.ToDoctorDTO();
    }

    /// <summary> Deletes an existing doctor </summary>
    /// <param name="id"></param>
    /// <returns>Boolean representation of deletion result</returns>
    public async Task<bool> DeleteDoctor(int id)
    {
        var doctor = await _ctx.Doctors.FindAsync(id);
        if(doctor == null) return false;

        _ctx.Doctors.Remove(doctor);

        await _ctx.SaveChangesAsync();
        
        return true;
    }
}