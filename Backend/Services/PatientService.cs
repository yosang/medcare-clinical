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

    public async Task<PatientWithDetailsDTO?> GetPatient(int id)
    {
        var patient = await _ctx.Patients.AsNoTracking()
                                        .Where(p => p.Id == id)
                                        .Select(patient => patient.ToPatientWithDetailsDTO())
                                        .FirstOrDefaultAsync();
        return patient;
    }

    public async Task<GuestPatientDTO> CreatePatient(CreateGuestPatientDTO dto)
    {
        var existing = await _ctx.Patients.AsNoTracking()
                                            .Where(p => p.FirstName == dto.FirstName)
                                            .Where(p => p.LastName == dto.LastName)
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

    public async Task<PatientDTO?> UpdatePatient(int patientId, UpdatePatientDTO dto)
    {
        var existing = await _ctx.Patients.FindAsync(patientId);
        if (existing == null) return null;

        existing.UpdateWith(dto);

        await _ctx.SaveChangesAsync();

        return existing.ToPatientDTO();
    }

    public async Task<bool> DeletePatient(int patientId)
    {
        var existing = await _ctx.Patients.FindAsync(patientId);
        if (existing == null) return false;

        _ctx.Patients.Remove(existing);

        await _ctx.SaveChangesAsync();

        return true;
    }
}