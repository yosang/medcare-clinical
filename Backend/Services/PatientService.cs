using Context;
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

    public async Task<IEnumerable<PatientWithDetailsDTO>> GetPatients()
    {
        var patients = await _ctx.Patients.AsNoTracking()
                                            .Include(p => p.Appointments)
                                            .Select(patient => patient.ToPatientWithDetailsDTO())
                                            .ToListAsync();
        return patients;
    }

    public async Task<PatientWithDetailsDTO?> GetPatient(int id)
    {
        var patient = await _ctx.Patients.AsNoTracking()
                                        .Where(p => p.Id == id)
                                        .Include(p => p.Appointments)
                                        .Select(patient => patient.ToPatientWithDetailsDTO())
                                        .FirstOrDefaultAsync();
        return patient;
    }
}