using DTOS;
using Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class PatientsController : ControllerBase
{

    private readonly PatientService _service;

    public PatientsController(PatientService service)
    {
        _service = service;
    }

    /// <summary>
    /// Retrieve details as a logged in patient
    /// </summary>
    /// <response code="200">Resource returned</response>
    /// <response code="401">Resource not found</response>
    /// <response code="404">Resource not found</response>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(PatientWithDetailsDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PatientWithDetailsDTO>> GetMyProfile()
    {
        var patientId = User.GetPatientId();
        if(patientId == null) return Unauthorized();

        var patient = await _service.GetPatient(patientId.Value);

        return Ok(patient);
    }

    /// <summary> Create a new guest patient</summary>
    /// <remarks>
    /// Sample request:
    /// 
    ///     {
    ///       "firstName": "Carina",
    ///       "lastName": "Bebek",
    ///       "phone": "24242424"
    ///     }
    /// 
    /// </remarks>
    /// <param name="dto"></param>
    /// <response code="201">Resource created</response>
    [HttpPost("guest")]
    [ProducesResponseType(typeof(GuestPatientDTO), StatusCodes.Status201Created)]
    public async Task<ActionResult<GuestPatientDTO>> CreateGuestPatient(CreateGuestPatientDTO dto)
    {
        var result = await _service.CreatePatient(dto);

        return CreatedAtAction(nameof(CreateGuestPatient), new { id = result.Id }, result);
    }

    /// <summary>
    /// Update profile as a logged inn patient
    /// </summary>
    /// <remarks>
    /// Sample request:
    /// 
    ///     {
    ///       "firstName": "Markus",
    ///       "lastName": "Hakon",
    ///       "phone": "24242424",
    ///       "email": "mh@mail.com",
    ///       "dateOfBirth": "1984-03-22",
    ///       "nationalIdentityNumber": "22222222222",
    ///       "password": "p@ssword",
    ///     }
    /// 
    /// </remarks>
    /// <param name="dto"></param>
    /// <response code="204">Update successful, no content returned</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="404">Resource not found</response>
    [HttpPut("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateMyProfile(UpdatePatientDTO dto)
    {
        var patientId = User.GetPatientId();
        if(patientId == null) return Unauthorized();

        var updated = await _service.UpdatePatient(patientId.Value, dto);
        if (updated == null) return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Delete patient profile as a logged in patient
    /// </summary>
    /// <response code="204">Resource deleted</response>
    /// <response code="401">Unauthorized</response>
    /// <response code="404">Resource not found</response>
    [HttpDelete("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteMyAccount()
    {
        var patientId = User.GetPatientId();
        if(patientId == null) return Unauthorized();

        var deleted = await _service.DeletePatient(patientId.Value);
        if (!deleted) return NotFound();

        return NoContent();
    }
}