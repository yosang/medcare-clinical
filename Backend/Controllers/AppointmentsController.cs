using DTOS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class AppointmentsController : ControllerBase
{
    private readonly AppointmentService _service;

    public AppointmentsController(AppointmentService service)
    {
        _service = service;
    }

    /// <summary>
    /// Returns a list of appointments
    /// </summary>
    /// <response code="200">Resources returned</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AppointmentWithDetailsDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AppointmentWithDetailsDTO>>> Get()
    {
        var appointments = await _service.GetAppointments();
        
        return Ok(appointments);
    }

    /// <summary>
    /// Get a single appointment
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Resouruce returned</response>
    /// <response code="404">Resource not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AppointmentWithDetailsDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AppointmentWithDetailsDTO?>> Get(int id)
    {
        var appointment = await _service.GetAppointment(id);

        if(appointment == null) return NotFound();

        return Ok(appointment);
    }

    /// <summary>Create a new appointment</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///        "AppointmentDate":"2026-05-24T08:30",
    ///        "Note":"Renewal of asthma medicine",
    ///        "PatientId": 1,
    ///        "DoctorId": 1,
    ///        "ClinicId": 1,
    ///        "CategoryId": 1,
    ///        "StatusId": 1
    ///     }
    ///
    /// </remarks>
    /// <param name="dto"></param>
    /// <response code="201">Resource created</response>
    [HttpPost]
    [ProducesResponseType(typeof(AppointmentDTO), StatusCodes.Status201Created)]
    public async Task<ActionResult<AppointmentDTO>> Create(CreateAppointmentDTO dto)
    {
        var IsAuthenticated = User.Identity!.IsAuthenticated;
        AppointmentDTO result;

        if(IsAuthenticated)
        {
            Console.WriteLine("Authentication detected");

            // We first validate the token, this must be a token that is not expired or ionvalid - This is handled by the JWT package
            // If validation passes, we retrieve the patient ID
            // We have to make sure the patientId claim is valid
            // If validation passes, we create the appointment
            // Then we create an appointment with the PatientId from the token

            var patiendIdClaim = User.FindFirst("PatientId");
            
            if(patiendIdClaim == null) return BadRequest(new ProblemDetails()
            {
               Title = "Invalid token",
               Detail = "PatientID claim is missing",
               Status = StatusCodes.Status400BadRequest 
            });

            if(!int.TryParse(patiendIdClaim.Value, out int patientId)) return BadRequest(new ProblemDetails()
            {
                Title = "Invalid token",
               Detail = "Invalid PatientID claim value",
               Status = StatusCodes.Status400BadRequest 
            });
            
            // We use the patientId retrieved from the claim to register the apppointment under its authenticated patient.
            dto.PatientId = patientId;

            result = await _service.CreateAppointment(dto); 
        } else
        {
            Console.WriteLine("No authentication detected");

            // Proceed to create an appoint, the frontend must provide the PatientId, which they create from Patient Controller
            result = await _service.CreateAppointment(dto); 
        }

        return CreatedAtAction(nameof(Get), new { id = result.Id}, result);
    }

    /// <summary>Update an appointment</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///        "AppointmentDate":"2026-05-24T09:00",
    ///        "Note":"Specialist referral",
    ///        "PatientId": 1,
    ///        "DoctorId": 1,
    ///        "ClinicId": 1,
    ///        "CategoryId": 1,
    ///        "StatusId": 1
    ///     }
    ///
    /// </remarks>
    /// <param name="id"></param>
    /// <param name="dto"></param>
    /// <response code="204">Update successful, no content returned</response>
    /// <response code="404">Resource not found by id</response>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, UpdateAppointmentDTO dto)
    {
        var updated = await _service.UpdateAppointment(id, dto);
        if(updated == null) return NotFound();

        return NoContent();
    }

    /// <summary>Delete an appointment</summary>
    /// <param name="id"></param>
    /// <response code="204">Deletion successful, no content returned</response>
    /// <response code="404">Resource not found by id</response>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<string>> Delete(int id)
    {
        var deleted = await _service.DeleteAppointment(id);
        if(!deleted) return NotFound();

        return NoContent();
    }
}