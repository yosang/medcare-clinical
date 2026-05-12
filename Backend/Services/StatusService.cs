using Context;
using DTOS;
using Extensions.Mappers;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;
public class StatusService
{
    private readonly DatabaseContext _ctx;

    public StatusService(DatabaseContext context)
    {
        _ctx = context;
    }

    public async Task<IEnumerable<StatusWithDetailsDTO>> GetStatuses()
    {

        var statuses = await _ctx.Statuses.AsNoTracking()
                                            .Include(s => s.Appointments)
                                            .Select(status => status.ToStatusWithDetailsDTO())
                                            .ToListAsync();

        return statuses;
    }

    public async Task<StatusWithDetailsDTO?> GetStatus(int id)
    {
        var status = await _ctx.Statuses.AsNoTracking()
                                        .Where(status => status.Id == id)
                                        .Include(s => s.Appointments)
                                        .Select(status => status.ToStatusWithDetailsDTO())
                                        .FirstOrDefaultAsync();
        return status;
    }

    public async Task<IEnumerable<AppointmentDTO>> GetAppointments(int id)
    {
        var appointments = await _ctx.Appointments.AsNoTracking()
                                        .Where(appointment => appointment.StatusId == id)
                                        .Select(appointment => appointment.ToAppointmentDTO())
                                        .ToListAsync();
        return appointments;
    }

    public async Task<StatusDTO> CreateStatus(CreateStatusDTO dto)
    {
        var newStatus = dto.ToStatus();

        _ctx.Statuses.Add(newStatus);

        await _ctx.SaveChangesAsync();

        return newStatus.ToStatusDTO();
    }

    public async Task<StatusDTO?> UpdateStatus(int id, UpdateStatusDTO dto)
    {
        var existing = await _ctx.Statuses.FindAsync(id);
        if(existing == null) return null;

        existing.UpdateWith(dto);

        await _ctx.SaveChangesAsync();

        return existing.ToStatusDTO();
    }

    public async Task<bool> DeleteStatus(int id)
    {
        var existing = await _ctx.Statuses.FindAsync(id);
        if(existing == null) return false;

        _ctx.Statuses.Remove(existing);

        await _ctx.SaveChangesAsync();
        
        return true;
    }
}