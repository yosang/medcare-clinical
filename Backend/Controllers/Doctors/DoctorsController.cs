using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class DoctorsController : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<string>> Get()
    {
        return "List of doctors";
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<string>> Get(int id)
    {
        return $"A single doctor with id {id}";
    }

    [HttpGet("{id}/appointments")]
    public async Task<ActionResult<string>> GetAppointments(int id)
    {
        return $"A list of appointments for doctor with id {id}";
    }

    [HttpPost]
    public async Task<ActionResult<string>> Create()
    {
        return "Doctor created";
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<string>> Update(int id)
    {
        return $"Doctor with id {id} updated";
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<string>> Delete(int id)
    {
        return $"Doctor with id {id} deleted";
    }
}