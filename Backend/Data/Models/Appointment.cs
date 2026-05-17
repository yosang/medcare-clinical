namespace Models;

public class Appointment
{
    // Primary key
    public int Id { get; set; }
    public required DateTime AppointmentDate { get; set; }
    public required int Duration { get; set; }
    public string? Note { get; set; }

    // Foreign Keys
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public int ClinicId { get; set; }
    public int CategoryId { get; set; }
    public int StatusId { get; set; }

    // Nav props
    public Patient? Patient { get; set; }
    public Doctor? Doctor { get; set; }
    public Clinic? Clinic { get; set; }
    public Category? Category { get; set; }
    public Status? Status { get; set; }
}