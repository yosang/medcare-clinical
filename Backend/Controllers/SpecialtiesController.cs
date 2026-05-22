using DTOS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class SpecialtiesController : ControllerBase
{
    private readonly SpecialtyService _service;

    public SpecialtiesController(SpecialtyService service) => (_service) = (service);

    /// <summary>
    /// Retrieves a list of specialties
    /// </summary>
    /// <response code="200">List of specialties returned</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SpecialtyDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<SpecialtyDTO>>> Get()
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
    [ProducesResponseType(typeof(SpecialtyDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SpecialtyDTO>> Get(int id)
    {
        var specialty = await _service.GetSpecialty(id);

        if(specialty == null) return NotFound();

        return Ok(specialty);
    }

    /// <summary>Create a new specialty</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///         "Name": "Neurologist"
    ///     }
    ///
    /// </remarks>
    /// <param name="specialty"></param>
    /// <response code="201">Resource created</response>
    /// <response code="401">Forbidden</response>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(SpecialtyDTO), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<SpecialtyDTO>> Create(CreateSpecialtyDTO specialty)
    {
        var result = await _service.CreateSpecialty(specialty);

        return CreatedAtAction(nameof(Get), new { id = result.Id}, result);
    }

    /// <summary>Update a specialty</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///         "Name": "Psychiatrist"
    ///     }
    ///
    /// </remarks>
    /// <param name="id"></param>
    /// <param name="specialty"></param>
    /// <response code="204">Update successful, no content returned</response>
    /// <response code="401">Forbidden</response>
    /// <response code="404">Resource not found by id</response>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, UpdateSpecialtyDTO specialty)
    {
        var updated = await _service.UpdateSpecialty(id, specialty);
        if(updated == null) return NotFound();

        return NoContent();
    }

    /// <summary>Delete a specialty</summary>
    /// <param name="id"></param>
    /// <response code="204">Deletion successful, no content returned</response>
    /// <response code="401">Forbidden</response>
    /// <response code="404">Resource not found by id</response>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteSpecialty(id);
        if(!deleted) return NotFound();

        return NoContent();
    }

}