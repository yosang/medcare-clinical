using Context;
using DTOS;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;
public class StatusService
{
    public readonly DatabaseContext _ctx;

    public StatusService(DatabaseContext context)
    {
        _ctx = context;
    }

    public async Task<IEnumerable<StatusWithDetailsDTO>> GetStatuses()
    {

        var statuses = await _ctx.Statuses.AsNoTracking()
                                            .Select(status => new StatusWithDetailsDTO
                                            {
                                                Id = status.Id,
                                                Name = status.Name,
                                                Appointments = status.Appointments!.Select(appointment => new AppointmentDTO
                                                {
                                                    Id = appointment.Id,
                                                    AppointmentDate = appointment.AppointmentDate,
                                                    Note = appointment.Note
                                                })
                                            }).ToListAsync();

        return statuses;
    }

    public async Task<StatusWithDetailsDTO?> GetStatus(int id)
    {
        var status = await _ctx.Statuses.AsNoTracking()
                                        .Where(status => status.Id == id)
                                        .Select(status => new StatusWithDetailsDTO
                                        {
                                            Id = status.Id,
                                            Name = status.Name,
                                            Appointments = status.Appointments!.Select(appointment => new AppointmentDTO
                                            {
                                                Id = appointment.Id,
                                                AppointmentDate = appointment.AppointmentDate,
                                                Note = appointment.Note
                                            })
                                        }).FirstOrDefaultAsync();
        return status;
    }

    public async Task<IEnumerable<AppointmentDTO>> GetAppointments(int id)
    {
        var appointments = await _ctx.Appointments.AsNoTracking()
                                        .Where(appointment => appointment.StatusId == id)
                                        .Select(appointment => new AppointmentDTO
                                        {
                                            Id = appointment.Id,
                                            AppointmentDate = appointment.AppointmentDate,
                                            Note = appointment.Note
                                        })
                                        .ToListAsync();
        return appointments;
    }

    public async Task<Status> CreateStatus(CreateStatusDTO status)
    {
        var newStatus = new Status
        {
            Name = status.Name
        };

        _ctx.Statuses.Add(newStatus);

        await _ctx.SaveChangesAsync();
        return newStatus;
    }

    public async Task<StatusDTO?> UpdateStatus(int id, UpdateStatusDTO status)
    {
        var existingStatus = await _ctx.Statuses.FindAsync(id);
        if(existingStatus == null) return null;

        existingStatus.Name = status.Name;

        await _ctx.SaveChangesAsync();

        return new StatusDTO
        {
            Id = existingStatus.Id,
            Name = existingStatus.Name
        };
    }

    public async Task<bool> DeleteStatus(int id)
    {
        var status = await _ctx.Statuses.FindAsync(id);
        if(status == null) return false;

        _ctx.Remove(status);

        await _ctx.SaveChangesAsync();
        
        return true;
    }
}