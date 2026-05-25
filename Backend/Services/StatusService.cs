using Data.Context;
using DTOS;
using Extensions.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Services;
public class StatusService
{
    private readonly DatabaseContext _ctx;

    public StatusService(DatabaseContext context)
    {
        _ctx = context;
    }

    /// <summary> Reads statuses from the database without tracking for reduced performance overhead </summary>
    /// <returns> List of statuses </returns>
    public async Task<IEnumerable<StatusDTO>> GetStatuses()
    {

        var statuses = await _ctx.Statuses.AsNoTracking()
                                            .Select(status => status.ToStatusDTO())
                                            .ToListAsync();

        return statuses;
    }

    /// <summary> Reads a single status from the database without tracking for reduced performance overhead </summary>
    /// <param name="id"></param>
    /// <returns> A single status </returns>
    public async Task<StatusDTO?> GetStatus(int id)
    {
        var status = await _ctx.Statuses.AsNoTracking()
                                        .Where(status => status.Id == id)
                                        .Select(status => status.ToStatusDTO())
                                        .FirstOrDefaultAsync();
        return status;
    }

    /// <summary> Writes a new status entity to the database </summary>
    /// <param name="dto"></param>
    /// <returns> Created status </returns>
    public async Task<StatusDTO> CreateStatus(CreateStatusDTO dto)
    {
        var newStatus = dto.ToStatus();

        _ctx.Statuses.Add(newStatus);

        await _ctx.SaveChangesAsync();

        return newStatus.ToStatusDTO();
    }

    /// <summary> Updates an existing status </summary>
    /// <param name="id"></param>
    /// <param name="dto"></param>
    /// <returns> Updated status </returns>
    public async Task<StatusDTO?> UpdateStatus(int id, UpdateStatusDTO dto)
    {
        var existing = await _ctx.Statuses.FindAsync(id);
        if(existing == null) return null;

        existing.UpdateWith(dto);

        await _ctx.SaveChangesAsync();

        return existing.ToStatusDTO();
    }


    /// <summary> Deletes an existing status </summary>
    /// <param name="id"></param>
    /// <returns> Boolean representation of deletion result </returns>
    public async Task<bool> DeleteStatus(int id)
    {
        var existing = await _ctx.Statuses.FindAsync(id);
        if(existing == null) return false;

        _ctx.Statuses.Remove(existing);

        await _ctx.SaveChangesAsync();
        
        return true;
    }
}