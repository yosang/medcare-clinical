using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class StatusController : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<string>> Get()
    {
        return "List of statuses";
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<string>> Get(int id)
    {
        return $"A single status with id {id}";
    }

    [HttpGet("{id}/appointments")]
    public async Task<ActionResult<string>> GetAppointments(int id)
    {
        return $"Appointments for status with id {id}";
    }

    [HttpPost]
    public async Task<ActionResult<string>> Create()
    {
        return "Status created";
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<string>> Update(int id)
    {
        return $"Status with id {id} updated";
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<string>> Delete(int id)
    {
        return $"Status with id {id} deleted";
    }
}