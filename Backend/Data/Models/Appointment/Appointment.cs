namespace Models;

public class Appointment
{
    // Primary key
    public int Id { get; set; }
    public required DateTime AppointmentDate { get; set;}
    public string? Note { get; set; }

    // Foreign Keys
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public int ClinicId { get; set; }
    public int CategoryId { get; set; }
    public int StatusId { get; set; }

    // Nav props
    public required Patient Patient { get; set; }
    public required Doctor Doctor { get; set; }
    public required Clinic Clinic { get; set; }
    public required Category Category { get; set; }
    public required Status Status { get; set; }
}