using DTOS;
using Microsoft.AspNetCore.Mvc;
using Services;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class CitiesController : ControllerBase
{

    public readonly CityService _service;

    public CitiesController(CityService cityService)
    {
        _service = cityService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CityWithDetailsDTO>>> Get()
    {
        var cities = await _service.GetCities();

        return Ok(cities);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CityWithDetailsDTO>> Get(int id)
    {
        var city = await _service.GetCity(id);

        if(city == null) return NotFound();

        return city;
    }

    [HttpGet("{id}/clinics")]
    public async Task<ActionResult<IEnumerable<ClinicDTO>>> GetClinics(int id)
    {
        var clinics = await _service.GetClinics(id);

        return Ok(clinics);
    }

    [HttpPost]
    public async Task<ActionResult<CityDTO>> Create(CreateCityDTO city)
    {
        var result = await _service.CreateCity(city);

        var cityDTO = new CityDTO
        {
            Id = result.Id,
            Name = result.Name
        };

        return CreatedAtAction(nameof(Get), new { id = cityDTO.Id }, cityDTO);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateCityDTO city)
    {
        var updated = await _service.UpdateCity(id, city);
        if(updated == null) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteCity(id);
        if(!deleted) return NotFound();

        return NoContent();
    }
}