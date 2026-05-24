using DTOS;
using Extensions;
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
    /// Returns a list of appointments for a logged in patient
    /// </summary>
    /// <response code="200">Resources returned</response>
    /// <response code="401">Unauthorized</response>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<AppointmentWithDetailsDTO>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<AppointmentWithDetailsDTO>>> GetMyAppointments()
    {
        var patientId = User.GetPatientId();
        if(patientId == null) return Unauthorized();

        var appointments = await _service.GetAppointmentsForPatient(patientId.Value);

        return Ok(appointments);
    }

    /// <summary>
    /// Get a single appointment
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Resouruce returned</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="404">Resource not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AppointmentWithDetailsDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AppointmentWithDetailsDTO?>> Get(int id)
    {
        var patientId = User.GetPatientId();
        if(patientId == null) return Unauthorized();

        var appointment = await _service.GetAppointment(id, patientId.Value);

        if (appointment == null) return NotFound();

        return Ok(appointment);
    }

    /// <summary>Create a new appointment (Frontend must provide a PatientId for Guests)</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///        "AppointmentDate":"2026-05-24T08:30",
    ///        "Duration": 30,
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
    /// <response code="400">Date and time overlaps</response>
    /// <response code="401">Unauthorized</response>
    [HttpPost]
    [ProducesResponseType(typeof(AppointmentDTO), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AppointmentDTO>> Create(CreateAppointmentDTO dto)
    {
        if (User.Identity!.IsAuthenticated)
        {
            var patientId = User.GetPatientId();
            if(patientId == null) return Unauthorized();

            dto.PatientId = patientId.Value;
        }

        var result = await _service.CreateAppointment(dto);

        if (result == null) return BadRequest(new ProblemDetails
        {
            Title = "Date overlap",
            Detail = "Provided date and time overlaps with an existing active appointment",
            Status = StatusCodes.Status400BadRequest
        });

        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    /// <summary>Update an appointment</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///        "AppointmentDate":"2026-05-24T09:00",
    ///        "Duration": 30,
    ///        "Note":"Specialist referral",
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
    /// <response code="400">Date and time overlaps</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="404">Resource not found by id</response>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, UpdateAppointmentDTO dto)
    {
        var patientId = User.GetPatientId();
        if(patientId == null) return Unauthorized();

        var result = await _service.UpdateAppointment(id, patientId.Value, dto);

        if(result.notFound) return NotFound();

        if (result.overlap) return BadRequest(new ProblemDetails
        {
            Title = "Date overlap",
            Detail = "Provided date and time overlaps with an existing appointment",
            Status = StatusCodes.Status400BadRequest
        });

        return NoContent();
    }

    /// <summary>Cancel an appointment</summary>
    /// <param name="id"></param>
    /// <response code="204">Cencellation successful, no content returned</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="404">Resource not found by id</response>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Cancel(int id)
    {
        var patientId = User.GetPatientId();
        if(patientId == null) return Unauthorized();

        var deleted = await _service.CancelAppointment(id, patientId.Value);
        if (!deleted) return NotFound();

        return NoContent();
    }
}
