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

    public string GenerateToken(Patient patient)
    {
        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer, 
            audience: _jwtSettings.Audience, 
            claims: new List<Claim>()
            {
                new Claim("PatientId", patient.Id.ToString())
            },
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes ?? 60),
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey)), SecurityAlgorithms.HmacSha256)
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return tokenString;
    }
}