using DTOS;
using Microsoft.AspNetCore.Mvc;
using Services;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class StatusController : ControllerBase
{

    private readonly StatusService _service;

    public StatusController(StatusService service) => (_service) = (service); 

    /// <summary>
    /// Returns a list of statuses
    /// </summary>
    /// <response code="200">Resources returned</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<StatusWithDetailsDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<StatusWithDetailsDTO>>> Get()
    {
        var statuses = await _service.GetStatuses();

        return Ok(statuses);
    }

    /// <summary>
    /// Returns a single status
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Resource returned</response>
    /// <response code="404">Resource not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(StatusWithDetailsDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StatusWithDetailsDTO>> Get(int id)
    {
        var status = await _service.GetStatus(id);
        if(status == null) return NotFound();

        return Ok(status);
    }

    /// <summary>
    /// Returns a list of Appointments for Status
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Resources returned</response>
    [HttpGet("{id}/appointments")]
    [ProducesResponseType(typeof(IEnumerable<AppointmentDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetAppointments(int id)
    {
        var appointments = await _service.GetAppointments(id);

        return Ok(appointments);
    }

    /// <summary>Create a new status</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///         "Name": "Scheduled"
    ///     }
    ///
    /// </remarks>
    /// <param name="status"></param>
    /// <response code="201">Resource created</response>
    [HttpPost]
    [ProducesResponseType(typeof(StatusDTO), StatusCodes.Status201Created)]
    public async Task<ActionResult<StatusDTO>> Create(CreateStatusDTO status)
    {
        var result = await _service.CreateStatus(status);

        return CreatedAtAction(nameof(Get), new { id = result.Id}, result);
    }

    /// <summary>Update a status</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///         "Name": "Postponed"
    ///     }
    ///
    /// </remarks>
    /// <param name="id"></param>
    /// <param name="status"></param>
    /// <response code="204">Update successful, no content returned</response>
    /// <response code="404">Resource not found by id</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, UpdateStatusDTO status)
    {
        var updated = await _service.UpdateStatus(id, status);
        if(updated == null) return NotFound();

        return NoContent();
    }

    /// <summary>Delete a status</summary>
    /// <param name="id"></param>
    /// <response code="204">Deletion successful, no content returned</response>
    /// <response code="404">Resource not found by id</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteStatus(id);
        if(!deleted) return NotFound();
        
        return NoContent();
    }
}