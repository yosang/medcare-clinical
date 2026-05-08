using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class PatientsController : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<string>> Get()
    {
        return "List of patients";
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<string>> Get(int id)
    {
        return $"A single patient with id {id}";
    }

    [HttpGet("{id}/appointments")]
    public async Task<ActionResult<string>> GetAppointments(int id)
    {
        return $"A list of appointments for patient with id {id}";
    }

    [HttpPost]
    public async Task<ActionResult<string>> Create()
    {
        return "Patient created";
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<string>> Update(int id)
    {
        return $"Patient with id {id} updated";
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<string>> Delete(int id)
    {
        return $"Patient with id {id} deleted";
    }
}