using DTOS;
using Models;

namespace Extensions.Mappers;

public static class StatusMapper
{
    public static StatusDTO ToStatusDTO(this Status status)
    {
        return new StatusDTO
        {
            Id = status.Id,
            Name = status.Name
        };
    }   

    public static Status ToStatus(this CreateStatusDTO dto)
    {
        return new Status
        {
            Name = dto.Name
        };
    }

    public static void UpdateWith(this Status existing, UpdateStatusDTO dto)
    {
        if(!string.IsNullOrWhiteSpace(dto.Name)) existing.Name = dto.Name;
    }
}