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
    // [HttpPost]
    // public async Task<ActionResult<LoginSuccessDTO>> Login(LoginDTO dto)
    // {
    // }

    [HttpPost("register")]
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