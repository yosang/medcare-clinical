using DTOS;
using Microsoft.AspNetCore.Mvc;
using Services;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class CitiesController : ControllerBase
{
    private readonly CityService _service;

    public CitiesController(CityService cityService)
    {
        _service = cityService;
    }

    /// <summary>
    /// Returns a list of cities
    /// </summary>
    /// <response code="200">Resources returned</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CityWithDetailsDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CityWithDetailsDTO>>> Get()
    {
        var cities = await _service.GetCities();

        return Ok(cities);
    }

    /// <summary>
    /// Returns a single city
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Resource returned</response>
    /// <response code="404">Resource not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CityWithDetailsDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CityWithDetailsDTO>> Get(int id)
    {
        var city = await _service.GetCity(id);

        if(city == null) return NotFound();

        return Ok(city);
    }

    /// <summary>
    /// Returns a list of Clinics for City
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Resources returned</response>
    [HttpGet("{id}/clinics")]
    [ProducesResponseType(typeof(IEnumerable<ClinicDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ClinicDTO>>> GetClinics(int id)
    {
        var clinics = await _service.GetClinics(id);

        return Ok(clinics);
    }

    /// <summary>Create a new city</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///         "Name": "Trondheim"
    ///     }
    ///
    /// </remarks>
    /// <param name="dto"></param>
    /// <response code="201">Resource created</response>
    [HttpPost]
    [ProducesResponseType(typeof(CityDTO), StatusCodes.Status201Created)]
    public async Task<ActionResult<CityDTO>> Create(CreateCityDTO dto)
    {
        var result = await _service.CreateCity(dto);

        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    /// <summary>Update a city</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///         "Name": "Kristiansand"
    ///     }
    ///
    /// </remarks>
    /// <param name="id"></param>
    /// <param name="dto"></param>
    /// <response code="204">Update successful, no content returned</response>
    /// <response code="404">Resource not found by id</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, UpdateCityDTO dto)
    {
        var updated = await _service.UpdateCity(id, dto);
        if(updated == null) return NotFound();

        return NoContent();
    }

    /// <summary>Delete a city</summary>
    /// <param name="id"></param>
    /// <response code="204">Deletion successful, no content returned</response>
    /// <response code="404">Resource not found by id</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteCity(id);
        if(!deleted) return NotFound();

        return NoContent();
    }
}