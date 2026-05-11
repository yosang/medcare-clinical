using DTOS;
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

    [HttpPost]
    public async Task<ActionResult<AppointmentDTO>> Create(CreateAppointmentDTO dto)
    {
        var result = await _service.CreateAppointment(dto);

        return CreatedAtAction(nameof(Get), new { id = result.Id}, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<string>> Update(int id)
    {
        return $"Appointment with id {id} updated";
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<string>> Delete(int id)
    {
        return $"Appointment with id {id} deleted";
    }
}