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
    /// <response code="409">An account that exists already</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(TokenDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register(RegisterPatientDTO dto)
    {
        var registered = await _service.Register(dto);
        if(!registered) return Conflict(new ProblemDetails()
        {
            Title = "Registration failed",
            Detail = "Could not complete registration. Please check your information and try again.",
            Status = StatusCodes.Status409Conflict
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
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refresh_token"];
        if(refreshToken == null) return Unauthorized();

        // We are letting the JWT framework validate the token based on our TokenValidationParameters configuration
        // If the validation fails and we get a SecurityTokenException, we return unauthorized instantly, instead of letting it crash the app
        // Any other error will bubble up and be caught by our global Exception handler, returning a 500 internal error
        try
        {
            var principal = new JwtSecurityTokenHandler().ValidateToken(refreshToken, new JWTTokenValidationParameters(_jwtSettings).tokenValidationParameters, out _);

            // The refresh token must have a PatientId claim.
            var patientId = principal.Claims.FirstOrDefault(p => p.Type == "PatientId");
            if (patientId == null) return Unauthorized();

            // Fetches patient details using the PatientId claim and creates a new access token
            var token = await _service.RefreshToken(int.Parse(patientId.Value));

            if(token == null ) return Unauthorized();

            return Ok(new { token = token.accessToken});
        } catch(SecurityTokenException)
        {
            return Unauthorized(new ProblemDetails()
            {
               Title = "Unauthorized",
               Detail = "The refresh token is invalid or has expired.",
               Status = StatusCodes.Status401Unauthorized 
            });
        }
    }

    /// <summary> Deletes a refresh token cookie from the browser </summary>
    /// <response code="204">No content</response>
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout()
    {
        Response.Cookies.Delete("refresh_token");

        return NoContent();
    }
}