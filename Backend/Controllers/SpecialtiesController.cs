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

    /// <summary>
    /// Retrieves a list of specialties
    /// </summary>
    /// <response code="200">List of specialties returned</response>
    [HttpGet]
    [ProducesResponseType(typeof(SpecialtyWithDetailsDTO), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<SpecialtyWithDetailsDTO>>> Get()
    {
        var specialties = await _service.GetSpecialties();
        return Ok(specialties);
    }

    /// <summary>
    /// Retrieve a single specialty
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Resource retrieved</response>
    /// <response code="404">Resource not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(SpecialtyWithDetailsDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SpecialtyWithDetailsDTO>> Get(int id)
    {
        var specialty = await _service.GetSpecialty(id);

        if(specialty == null) return NotFound();

        return Ok(specialty);
    }

    /// <summary>
    /// Returns a list of Doctors for Specialty
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Resources returned</response>
    [HttpGet("{id}/doctors")]
    [ProducesResponseType(typeof(IEnumerable<DoctorDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DoctorDTO>>> GetDoctors(int id)
    {
        var doctors = await _service.GetDoctors(id);

        return Ok(doctors);
    }

    /// <summary>Create a new specialty</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///         "Name": "Cardiologist",
    ///     }
    ///
    /// </remarks>
    /// <param name="specialty"></param>
    /// <response code="201">Resource created</response>
    [HttpPost]
    [ProducesResponseType(typeof(SpecialtyDTO), StatusCodes.Status201Created)]
    public async Task<ActionResult<SpecialtyDTO>> Create(CreateSpecialtyDTO specialty)
    {
        var result = await _service.CreateSpecialty(specialty);

        var created = new SpecialtyDTO
        {
          Id = result.Id,
          Name = result.Name  
        };

        return CreatedAtAction(nameof(Get), new { id = created.Id}, created);
    }

    /// <summary>Update a specialty</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///         "Name": "Cardiologist",
    ///     }
    ///
    /// </remarks>
    /// <param name="id"></param>
    /// <param name="specialty"></param>
    /// <response code="204">Update successful, no content returned</response>
    /// <response code="404">Resource not found by id</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<string>> Update(int id, UpdateSpecialtyDTO specialty)
    {
        var updated = await _service.UpdateSpecialty(id, specialty);
        if(updated == null) return NotFound();

        return NoContent();
    }

    /// <summary>Delete a specialty</summary>
    /// <param name="id"></param>
    /// <response code="204">Deletion successful, no content returned</response>
    /// <response code="404">Resource not found by id</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<string>> Delete(int id)
    {
        var deleted = await _service.DeleteSpecialty(id);
        if(!deleted) return NotFound();

        return NoContent();
    }

}