using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Data.JWT;
using Microsoft.IdentityModel.Tokens;
using Models;
public class TokenService
{

    public JWTSettings _jwtSettings;

    public TokenService(JWTSettings jwtSettings)
    {
        _jwtSettings = jwtSettings;
    }

    /// <summary>
    /// Generates a short lived access token
    /// </summary>
    /// <param name="patient"></param>
    public string GenerateAccessToken(Patient patient)
    {
        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer, 
            audience: _jwtSettings.Audience, 
            claims: new List<Claim>()
            {
                new Claim(ClaimTypes.Role, GetRoleName(patient.RoleId)),
                new Claim("PatientId", patient.Id.ToString())
            },
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes ?? 15),
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey)), SecurityAlgorithms.HmacSha256)
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return tokenString;
    }
    /// <summary>
    /// Generates a refresh token that can be used to generate new access tokens
    /// </summary>
    /// <param name="patient"></param>
    public string GenerateRefreshToken(Patient patient)
    {
        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer, 
            audience: _jwtSettings.Audience, 
            claims: new List<Claim>()
            {
                new Claim("PatientId", patient.Id.ToString())
            },
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey)), SecurityAlgorithms.HmacSha256)
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return tokenString;
    }

    private string GetRoleName(int roleId)
    {
        return roleId switch
        {
            1 => "Patient",
            2 => "Admin",
            _ => "Patient"
        };
    }
}