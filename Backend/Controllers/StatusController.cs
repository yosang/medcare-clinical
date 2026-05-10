using DTOS;
using Microsoft.AspNetCore.Mvc;
using Services;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class StatusController : ControllerBase
{

    public readonly StatusService _service;

    public StatusController(StatusService service) => (_service) = (service); 

    [HttpGet]
    public async Task<ActionResult<StatusWithDetailsDTO>> Get()
    {
        var statuses = await _service.GetStatuses();

        return Ok(statuses);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StatusDTO>> Get(int id)
    {
        var status = await _service.GetStatus(id);
        if(status == null) return NotFound();

        return Ok(status);
    }

    [HttpGet("{id}/appointments")]
    public async Task<ActionResult<string>> GetAppointments(int id)
    {
        var appointments = await _service.GetAppointments(id);

        return Ok(appointments);
    }

    [HttpPost]
    public async Task<ActionResult<string>> Create(CreateStatusDTO status)
    {
        var result = await _service.CreateStatus(status);
        
        var created = new StatusDTO
        {
            Id = result.Id,
            Name = result.Name
        };

        return CreatedAtAction(nameof(Get), new { id = created.Id}, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<string>> Update(int id, UpdateStatusDTO status)
    {
        var updated = await _service.UpdateStatus(id, status);
        if(updated == null) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<string>> Delete(int id)
    {
        var deleted = await _service.DeleteStatus(id);
        if(!deleted) return NotFound();
        
        return NoContent();
    }
}