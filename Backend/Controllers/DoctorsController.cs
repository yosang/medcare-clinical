using DTOS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class DoctorsController : ControllerBase
{
    private readonly DoctorService _service;

    public DoctorsController(DoctorService service)
    {
        _service = service;
    }

    /// <summary>
    /// Returns a list of doctors
    /// </summary>
    /// <response code="200">Resources returned</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DoctorWithDetailsDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DoctorWithDetailsDTO>>> Get()
    {
        var doctors = await _service.GetDoctors();

        return Ok(doctors);
    }

    /// <summary>
    /// Returns a list of doctors matching firstname / lastname search term
    /// </summary>
    /// <response code="200">Resources returned</response>
    [HttpGet("search")]
    [ProducesResponseType(typeof(IEnumerable<DoctorWithDetailsDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DoctorWithDetailsDTO>>> Get(string name)
    {
        var doctors = await _service.GetDoctors(name);

        return Ok(doctors);
    }

    /// <summary>
    /// Returns a single doctor
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Resource returned</response>
    /// <response code="404">Resource not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(DoctorDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DoctorDTO>> Get(int id)
    {
        var doctor = await _service.GetDoctor(id);
        if(doctor == null ) return NotFound();

        return Ok(doctor);
    }

    /// <summary>Create a new doctor</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///       "firstName": "Henry",
    ///       "lastName": "Jekyll",
    ///       "email": "drjekyll@mail.com",
    ///       "specialtyId": 1,
    ///       "clinicId": 1
    ///     }
    ///
    /// </remarks>
    /// <param name="doctor"></param>
    /// <response code="201">Resource created</response>
    /// <response code="403">Forbidden</response>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(DoctorDTO), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<DoctorDTO>> Create(CreateDoctorDTO doctor)
    {
        var result = await _service.CreateDoctor(doctor);

        return CreatedAtAction(nameof(Get), new { id = result.Id}, result);
    }

    /// <summary>Update a doctor</summary>
    /// <remarks>
    /// Sample request:
    ///
    ///     {
    ///       "firstName": "Edward",
    ///       "lastName": "Hyde",
    ///       "email": "mrhyde@mail.com",
    ///       "specialtyId": 2,
    ///       "clinicId": 1
    ///     }
    ///
    /// </remarks>
    /// <param name="id"></param>
    /// <param name="doctor"></param>
    /// <response code="204">Update successful, no content returned</response>
    /// <response code="403">Forbidden</response>
    /// <response code="404">Resource not found by id</response>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, UpdateDoctorDTO doctor)
    {
        var updated = await _service.UpdateDoctor(id, doctor);
        if(updated == null) return NotFound();
        return NoContent();
    }

    /// <summary>Delete a doctor</summary>
    /// <param name="id"></param>
    /// <response code="204">Deletion successful, no content returned</response>
    /// <response code="403">Forbidden</response>
    /// <response code="404">Resource not found by id</response>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
 
        var deleted = await _service.DeleteDoctor(id);
        if(!deleted) return NotFound();
        return NoContent();
    }
}