using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class ClinicsController : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<string>> Get()
    {
        return "List of clinics";
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<string>> Get(int id)
    {
        return $"A single clinic with id {id}";
    }

    [HttpGet("{id}/doctors")]
    public async Task<ActionResult<string>> GetDoctors(int id)
    {
        return $"A list of doctors for clinic with id {id}";
    }

    [HttpPost]
    public async Task<ActionResult<string>> Create()
    {
        return "Clinic created";
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<string>> Update(int id)
    {
        return $"Clinic with id {id} updated";
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<string>> Delete(int id)
    {
        return $"Clinic with id {id} deleted";
    }
}