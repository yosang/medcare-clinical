using DTOS;
using Microsoft.AspNetCore.Authorization;
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

    /// <summary>
    /// Retrieve a list of clinics
    /// </summary>
    /// <response code="200">Resource list retrieved</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ClinicWithDetailsDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ClinicWithDetailsDTO>>> Get()
    {
        var clinics = await _service.GetClinics();

        return Ok(clinics);
    }

    /// <summary>
    /// Retrieve a single clinic
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Resource retrieved</response>
    /// <response code="404">Resource not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ClinicWithDetailsDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ClinicWithDetailsDTO>> Get(int id)
    {
        var clinic = await _service.GetClinic(id);
        if(clinic == null) return NotFound();

        return Ok(clinic);
    }

    /// <summary>
    /// Retrieve a list of doctors for clinic
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Resource list retrieved</response>
    [HttpGet("{id}/doctors")]
    [ProducesResponseType(typeof(IEnumerable<DoctorDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DoctorDTO>>> GetDoctors(int id)
    {
        var doctors = await _service.GetDoctors(id);
        return Ok(doctors);
    }
    
    /// <summary>
    /// Create a new clinic
    /// </summary>
    /// <remarks>
    /// Sample request:
    /// 
    ///     {
    ///         "Name": "New clinic",
    ///         "Phone": "555555",
    ///         "Email": "clinic@email.com",
    ///         "Address": "someaddress",
    ///         "PostalCode": "1234",
    ///         "CityId": 1
    ///     }
    /// 
    /// </remarks>
    /// <param name="dto"></param>
    /// <response code="201">Resource updated successfully, created resource returned</response>
    /// <response code="403">Forbidden</response>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ClinicDTO), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ClinicDTO>> Create(CreateClinicDTO dto)
    {
        var result = await _service.CreateClinic(dto);

        return CreatedAtAction(nameof(Get), new { id = result.Id}, result);
    }

    /// <summary>
    /// Update an existing clinic
    /// </summary>
    /// <remarks>
    /// Sample request:
    /// 
    ///     {
    ///         "Name": "New clinic value",
    ///         "Phone": "555555",
    ///         "Email": "clinic@email.com",
    ///         "Address": "someaddress",
    ///         "PostalCode": "1234",
    ///         "CityId": 2
    ///     }
    /// 
    /// </remarks>
    /// <param name="id"></param>
    /// <param name="dto"></param>
    /// <response code="204">Resource updated successfully, no content returned</response>
    /// <response code="403">Forbidden</response>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Update(int id, UpdateClinicDTO dto)
    {
        var updated = await _service.UpdateClinic(id, dto);
        if(updated == null) return NotFound();
        
        return NoContent();
    }

    /// <summary>
    /// Removes a clinic
    /// </summary>
    /// <param name="id"></param>
    /// <response code="204">Resource deleted successfully, no content returned</response>
    /// <response code="403">Forbidden</response>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteClinic(id);
        if(!deleted) return NotFound();
        return NoContent();
    }
}