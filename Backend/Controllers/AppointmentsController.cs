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

    public enum SortOrder
    {
        asc,
        desc
    }

    public enum StatusFilter
    {
        pending = 1,
        completed,
        cancelled
    }

    /// <summary>
    /// Returns a list of appointments for a logged in patient
    /// </summary>
    /// <param name="page">Page to show</param>
    /// <param name="itemsPerPage">Amount of items to show per page</param>
    /// <param name="sort">Orders the items in ascending / descending order by appointment date</param>
    /// <response code="200">Resources returned</response>
    /// <response code="401">Unauthorized</response>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<AppointmentWithDetailsDTO>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> Get( 
        [FromQuery] int? page = null, 
        [FromQuery] int? itemsPerPage = null,
        [FromQuery] SortOrder sort = SortOrder.asc,
        [FromQuery] StatusFilter? status = null
        )
    {
        var patientId = User.GetPatientId();
        if(patientId == null) return Unauthorized();

        var appointments = await _service.GetAppointments(patientId.Value);
        
        // Sorts the appointments, asc by default
        appointments = sort == SortOrder.asc ? appointments.OrderBy(a => a.AppointmentDate):appointments.OrderByDescending(a => a.AppointmentDate);

        // Filters by status
        if(status.HasValue) appointments = appointments.Where(a => a.Status!.Id == (int)status.Value);

        // If no pagination is requested, we simply return an array with appointments
        if(page == null || itemsPerPage == null) return Ok(appointments);

        // Returns a paginated object if pagination is requested
        var paginated = appointments.Skip((page.Value - 1) * itemsPerPage.Value).Take(itemsPerPage.Value);

        bool hasNextPage = (page.Value * itemsPerPage.Value) < appointments.Count();

        return Ok(new PaginatedAppointments<AppointmentWithDetailsDTO>
        {
            Data = paginated,
            HasNextPage = hasNextPage
        });
    }

    /// <summary>
    /// Returns a single appointment
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

    /// <summary>Creates a new appointment</summary>
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
    /// <response code="409">Appointment time overlaps with an existing appointment</response>
    [HttpPost]
    [ProducesResponseType(typeof(AppointmentDTO), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AppointmentDTO>> Create(CreateAppointmentDTO dto)
    {
        var result = await _service.CreateAppointment(dto);

        if (result == null) return Conflict(new ProblemDetails
        {
            Title = "Date overlap",
            Detail = "Appointment time overlaps with an existing appointment. Please choose a different time slot.",
            Status = StatusCodes.Status409Conflict
        });

        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    /// <summary>Updates an appointment</summary>
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
    /// <response code="401">Unauthorized</response>
    /// <response code="404">Resource not found by id</response>
    /// <response code="409">Appointment time overlaps with an existing appointment</response>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Update(int id, UpdateAppointmentDTO dto)
    {
        var patientId = User.GetPatientId();
        if(patientId == null) return Unauthorized();

        var result = await _service.UpdateAppointment(id, patientId.Value, dto);

        if(result.notFound) return NotFound();

        if (result.overlap) return Conflict(new ProblemDetails
        {
            Title = "Date overlap",
            Detail = "Appointment time overlaps with an existing appointment. Please choose a different time slot.",
            Status = StatusCodes.Status409Conflict
        });

        return NoContent();
    }

    /// <summary>Cancels an appointment</summary>
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

        var cancelled = await _service.CancelAppointment(id, patientId.Value);
        if (!cancelled) return NotFound();

        return NoContent();
    }
}
