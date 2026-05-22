using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DTOS;

public class AppointmentDTO
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public int Duration { get; set; }
    public string? Note { get; set; }
}

public class AppointmentWithDetailsDTO
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public int Duration { get; set; }
    public string? Note { get; set; }

    public DoctorDTO? Doctor { get; set; }
    public CategoriesDTO? Category { get; set; }
    public StatusDTO? Status { get; set; }
    public ClinicDTO? Clinic { get; set; }
}

public class CreateAppointmentDTO
{
    [Required]
    [DataType(DataType.DateTime)]
    public DateTime AppointmentDate { get; set; }
    
    [Required]
    public int Duration { get; set; }
    public string? Note { get; set; }

    public int? PatientId { get; set; }

    [DefaultValue(1)]
    [Range(1, int.MaxValue)]
    public int DoctorId { get; set; }
    [DefaultValue(1)]
    [Range(1, int.MaxValue)]
    public int ClinicId { get; set; }
    [DefaultValue(1)]
    [Range(1, int.MaxValue)]
    public int CategoryId { get; set; }
    [DefaultValue(1)]
    [Range(1, int.MaxValue)]
    public int StatusId { get; set; }
}

public class UpdateAppointmentDTO
{
    [DataType(DataType.DateTime)]
    public DateTime AppointmentDate { get; set; }

    [DefaultValue(30)]
    public int Duration { get; set; }
    public string? Note { get; set; }

    [DefaultValue(1)]
    [Range(1, int.MaxValue)]
    public int? DoctorId { get; set; }
    [DefaultValue(1)]
    [Range(1, int.MaxValue)]
    public int? ClinicId { get; set; }
    [DefaultValue(1)]
    [Range(1, int.MaxValue)]
    public int? CategoryId { get; set; }
    [DefaultValue(1)]
    [Range(1, int.MaxValue)]
    public int? StatusId { get; set; }
}