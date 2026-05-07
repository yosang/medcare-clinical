using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class CitiesController : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<string>> Get()
    {
        return "List of cities";
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<string>> Get(int id)
    {
        return $"A single city with id {id}";
    }

    [HttpGet("{id}/clinics")]
    public async Task<ActionResult<string>> GetClinics(int id)
    {
        return $"Clinics for city with id {id}";
    }

    [HttpPost]
    public async Task<ActionResult<string>> Create()
    {
        return "City created";
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<string>> Update(int id)
    {
        return $"City with id {id} updated";
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<string>> Delete(int id)
    {
        return $"City with id {id} deleted";
    }
}