using DTOS;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly AuthService _service;

    public AuthController(AuthService service)
    {
        _service = service;
    }

    /// <summary>
    /// Login with an existing Patient account
    /// </summary>
    /// <param name="dto"></param>
    /// <response code="200">Returns token on successful login</response>
    /// <response code="401">Failure to authenticate the user</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(TokenDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<TokenDTO>> Login(LoginPatientDTO dto)
    {
        var token = await _service.Login(dto);

        if(token == null) return Unauthorized(new ProblemDetails()
        {
            Title = "Authentication failed",
            Detail = "Invalid Credentials",
            Status = StatusCodes.Status401Unauthorized
        });

        return Ok(token);
    }

    /// <summary>
    /// Register a patient account
    /// </summary>
    /// <param name="dto"></param>
    /// <response code="200">Returns token on successful registration</response>
    /// <response code="409">Cannot register an account that exists already</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(TokenDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<TokenDTO>> Register(RegisterPatientDTO dto)
    {
        var token = await _service.Register(dto);
        if(token == null) return Conflict(new ProblemDetails()
        {
            Title = "Existing account found",
            Detail = "An existing account with this email adress was found",
            Status = StatusCodes.Status409Conflict
        });

        return Ok(token);
    }
}