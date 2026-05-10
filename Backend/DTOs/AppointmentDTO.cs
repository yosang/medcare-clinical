namespace DTOS;

public class AppointmentDTO
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string? Note { get; set; }
}