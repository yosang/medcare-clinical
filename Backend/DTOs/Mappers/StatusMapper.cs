using DTOS;
using Models;

namespace Services.Mappers;

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
}