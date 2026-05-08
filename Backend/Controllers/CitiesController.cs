using DTOS;
using Microsoft.AspNetCore.Mvc;
using Services;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class CitiesController : ControllerBase
{

    public CityService _service { get; set; }

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