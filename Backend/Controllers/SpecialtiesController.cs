using DTOS;
using Microsoft.AspNetCore.Mvc;
using Services;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class SpecialtiesController : ControllerBase
{

    public readonly SpecialtyService _service;

    public SpecialtiesController(SpecialtyService service) => (_service) = (service);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SpecialtyWithDetailsDTO>>> Get()
    {
        var specialties = await _service.GetSpecialties();
        return Ok(specialties);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<string>> Get(int id)
    {
        return $"Single speciality with id {id}";
    }

    [HttpGet("{id}/doctors")]
    public async Task<ActionResult<string>> GetDoctors(int id)
    {
        return $"List of doctors with speciality id {id}";
    }

    [HttpPost]
    public async Task<ActionResult<string>> Create()
    {
        return "Specialty created";
    }
    [HttpPut("{id}")]
    public async Task<ActionResult<string>> Update(int id)
    {
        return $"Updated specialty with id {id}";
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult<string>> Delete(int id)
    {
        return $"Deleted specialty with id {id}";
    }

}