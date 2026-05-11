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
    public async Task<ActionResult<string>> GetAppointments(int id)
    {
        return $"A list of appointments for patient with id {id}";
    }

    [HttpPost]
    public async Task<ActionResult<string>> Create()
    {
        return "Patient created";
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<string>> Update(int id)
    {
        return $"Patient with id {id} updated";
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<string>> Delete(int id)
    {
        return $"Patient with id {id} deleted";
    }
}