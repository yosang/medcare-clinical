using DTOS;
using Microsoft.AspNetCore.Mvc;
using Services;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class ClinicsController : ControllerBase
{
    private readonly ClinicService _service;

    public ClinicsController(ClinicService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClinicWithDetailsDTO>>> Get()
    {
        var clinics = await _service.GetClinics();

        return Ok(clinics);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClinicWithDetailsDTO>> Get(int id)
    {
        var clinic = await _service.GetClinic(id);
        if(clinic == null) return NotFound();

        return Ok(clinic);
    }

    [HttpGet("{id}/doctors")]
    public async Task<ActionResult<string>> GetDoctors(int id)
    {
        return $"A list of doctors for clinic with id {id}";
    }

    [HttpPost]
    public async Task<ActionResult<ClinicDTO>> Create(CreateClinicDTO dto)
    {
        var result = await _service.CreateClinic(dto);

        return CreatedAtAction(nameof(Get), new { id = result.Id}, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateClinicDTO dto)
    {
        var updated = await _service.UpdateClinic(id, dto);
        if(updated == null) return NotFound();
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<string>> Delete(int id)
    {
        var deleted = await _service.DeleteClinic(id);
        if(!deleted) return NotFound();
        return NoContent();
    }
}