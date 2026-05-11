using System.ComponentModel.DataAnnotations;

namespace DTOS;

public class AppointmentDTO
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string? Note { get; set; }
}

public class AppointmentWithDetailsDTO
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string? Note { get; set; }
    
    public DoctorDTO? Doctor { get; set; }
    public PatientDTO? Patient { get; set; }
    public CategoryDTO? Category { get; set; }
    public StatusDTO? Status { get; set; }
    public ClinicDTO? Clinic { get; set; }
}

public class CreateAppointmentDTO
{
    public int Id { get; set; }
    
    [Required]
    public DateTime AppointmentDate { get; set; }
    public string? Note { get; set; }
    
    public int PatientId { get; set; }    
    public int DoctorId { get; set; }    
    public int ClinicId { get; set; }    
    public int CategoryId { get; set; }    
    public int StatusId { get; set; }    
}

public class UpdateAppointmentDTO
{
    public int Id { get; set; }

    [Required]
    public DateTime AppointmentDate { get; set; }
    public string? Note { get; set; }
    
    public int PatientId { get; set; }    
    public int DoctorId { get; set; }    
    public int ClinicId { get; set; }    
    public int CategoryId { get; set; }    
    public int StatusId { get; set; }    
}