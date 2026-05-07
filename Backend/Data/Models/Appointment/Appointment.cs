namespace Models;

public class Appointment
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set;}
    public string Note { get; set; }

    // Foreign Keys
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public int ClinicId { get; set; }
    public int CategoryId { get; set; }
    public int StatusId { get; set; }
}