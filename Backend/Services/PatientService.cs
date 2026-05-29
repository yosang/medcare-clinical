using Data.Context;
using DTOS;
using Extensions.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Services;

public class PatientService
{
    private readonly DatabaseContext _ctx;

    public PatientService(DatabaseContext context)
    {
        _ctx = context;
    }

    /// <summary> Reads a single patient from the database without tracking for reduced performance overhead </summary>
    /// <param name="id"></param>
    /// <returns>A single patient with details</returns>
    public async Task<PatientWithDetailsDTO?> GetPatient(int id)
    {
        var patient = await _ctx.Patients.AsNoTracking()
                                        .Where(p => p.Id == id)
                                        .Select(patient => patient.ToPatientWithDetailsDTO())
                                        .FirstOrDefaultAsync();
        return patient;
    }

    /// <summary> 
    /// Writes a new patient entity to the database. This service is used to create guest patients with limited personal details.
    /// If an entity matching firstname / lastname / dateOfBirth is found in the database, return the entity to prevent duplicate records.
    /// </summary>
    /// <param name="dto"></param>
    /// <returns>Created patient</returns>
    public async Task<GuestPatientDTO> CreatePatient(CreateGuestPatientDTO dto)
    {
        var existing = await _ctx.Patients.AsNoTracking()
                                            .Where(p => p.FirstName == dto.FirstName)
                                            .Where(p => p.LastName == dto.LastName)
                                            .Where(p => p.DateOfBirth == dto.DateOfBirth)
                                            .FirstOrDefaultAsync();

        if(existing != null)
        {
            return existing.ToGuestPatientDTO();
        }

        var newP = dto.ToPatient();

        _ctx.Patients.Add(newP);

        await _ctx.SaveChangesAsync();

        return newP.ToGuestPatientDTO();
    }

    /// <summary> Updates an existing patient </summary>
    /// <param name="patientId"></param>
    /// <param name="dto"></param>
    /// <returns>Updated patient</returns>
    public async Task<PatientDTO?> UpdatePatient(int patientId, UpdatePatientDTO dto)
    {
        var existing = await _ctx.Patients.FindAsync(patientId);
        if (existing == null) return null;

        existing.UpdateWith(dto);

        await _ctx.SaveChangesAsync();

        return existing.ToPatientDTO();
    }

    /// <summary> Deletes an existing patient </summary>
    /// <param name="patientId"></param>
    /// <returns>Boolean representation of deletion result</returns>
    public async Task<bool> DeletePatient(int patientId)
    {
        var existing = await _ctx.Patients.FindAsync(patientId);
        if (existing == null) return false;

        _ctx.Patients.Remove(existing);

        await _ctx.SaveChangesAsync();

        return true;
    }
}