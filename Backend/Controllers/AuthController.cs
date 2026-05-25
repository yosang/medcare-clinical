using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Data.JWT;
using DTOS;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

[ApiController]
[Route("api/[Controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly AuthService _service;
    private readonly JWTSettings _jwtSettings;

    public AuthController(AuthService service, JWTSettings jwtSettings)
    {
        _service = service;
        _jwtSettings = jwtSettings;
    }

    /// <summary>
    /// Login with an existing account
    /// Issues a short-lived access token for the frontend to store in memory / localstorage, this one expires quickly (15 mins)
    /// - once expired the frontend must request a new access token using the refresh token, which has a longer lifespan.
    /// Issues a refresh token as a httpOnly secure cookie to the browser, this cookie cannot be deleted or accessed by frontend code.
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

       Response.Cookies.Append("refresh_token", token.refreshToken, new CookieOptions
       {
           HttpOnly = true,
            // Secure = true, // we are not using https, so comment out for now
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(7)
       });

        return Ok(new { token = token.accessToken});
    }

    /// <summary>
    /// Register a patient account
    /// </summary>
    /// <param name="dto"></param>
    /// <response code="200">Returns token on successful registration</response>
    /// <response code="400">An account that exists already</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(TokenDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register(RegisterPatientDTO dto)
    {
        var registered = await _service.Register(dto);
        if(!registered) return Conflict(new ProblemDetails()
        {
            Title = "Registration failed",
            Detail = "Could not complete registration. Please check your information and try again.",
            Status = StatusCodes.Status400BadRequest
        });

        return NoContent();
    }

    /// <summary> 
    /// Retrieves httpOnly cooke from browser.
    /// Validates the refresh token
    /// Issues a new access token on successful validation. 
    /// </summary>
    /// <response code="200">Returns new access token</response>
    /// <response code="401">Unauthorized</response>
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refresh_token"];
        if(refreshToken == null) return Unauthorized();

        var principal = new JwtSecurityTokenHandler().ValidateToken(refreshToken, new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = _jwtSettings.Issuer,
                        ValidateAudience = true,
                        ValidAudience = _jwtSettings.Audience,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey!))
                    }, out SecurityToken validatedToken);

        var patientId = principal.Claims.FirstOrDefault(p => p.Type == "PatientId");

        if (patientId == null) return Unauthorized();

        var token = await _service.RefreshToken(int.Parse(patientId.Value));

        if(token == null ) return Unauthorized();

        return Ok(new { token = token.accessToken});
    }

    /// <summary> Deletes a refresh token cookie from the browser </summary>
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        Response.Cookies.Delete("refresh_token");

        return NoContent();
    }
}