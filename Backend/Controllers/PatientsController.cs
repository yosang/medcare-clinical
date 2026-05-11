using DTOS;
using Microsoft.AspNetCore.Mvc;
using Models;
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
    /// Retrieve a list of patients
    /// </summary>
    /// <response code="200">Resources returned</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PatientWithDetailsDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PatientWithDetailsDTO>>> Get()
    {
        var patients = await _service.GetPatients();

        return Ok(patients);
    }

    /// <summary>
    /// Retreive a single patient
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Resource returned</response>
    /// <response code="404">Resource not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PatientWithDetailsDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PatientWithDetailsDTO>> Get(int id)
    {
        var patient = await _service.GetPatient(id);
        if (patient == null) return NotFound();
        return Ok(patient);
    }

    [HttpGet("{id}/appointments")]
    public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetAppointments(int id)
    {
        var appointments = await _service.GetAppointments(id);

        return Ok(appointments);
    }

    /// <summary> Create a new patient </summary>
    /// <remarks>
    /// Sample request:
    /// 
    ///     {
    ///       "firstName": "Carina",
    ///       "lastName": "Bebek",
    ///       "phone": "24242424",
    ///       "email": "cb@mail.com",
    ///       "dateOfBirth": "1984-03-22",
    ///       "nationalIdentityNumber": 66666666,
    ///       "passwordHash": "FAKEHASH",
    ///       "isRegistered": true
    ///     }
    /// 
    /// </remarks>
    /// <param name="dto"></param>
    /// <response code="201">Resource created</response>
    [HttpPost]
    [ProducesResponseType(typeof(PatientDTO), StatusCodes.Status201Created)]
    public async Task<ActionResult<PatientDTO>> Create(CreatePatientDTO dto)
    {
        var result = await _service.CreatePatient(dto);

        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    /// <summary>
    /// Update an existing patient
    /// </summary>
    /// <remarks>
    /// Sample request:
    /// 
    ///     {
    ///       "firstName": "Carina",
    ///       "lastName": "Bebek",
    ///       "phone": "24242424",
    ///       "email": "cb@mail.com",
    ///       "dateOfBirth": "1984-03-22",
    ///       "nationalIdentityNumber": 66666666,
    ///       "passwordHash": "FAKEHASH",
    ///       "isRegistered": true
    ///     }
    /// 
    /// </remarks>
    /// <param name="id"></param>
    /// <param name="dto"></param>
    /// <response code="204">Update successful, no content returned</response>
    /// <response code="404">Resource not found</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, UpdatePatientDTO dto)
    {
        var updated = await _service.UpdatePatient(id, dto);
        if (updated == null) return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Delete a patient
    /// </summary>
    /// <param name="id"></param>
    /// <response code="204">Resource deleted</response>
    /// <response code="404">Resource not found</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeletePatient(id);
        if (!deleted) return NotFound();

        return NoContent();
    }
}