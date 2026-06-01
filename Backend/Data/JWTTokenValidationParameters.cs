using System.Text;
using Data.JWT;
using Microsoft.IdentityModel.Tokens;

public class JWTTokenValidationParameters
{
    private JWTSettings _jwtSettings;

    public JWTTokenValidationParameters(JWTSettings jwtSettings)
    {
        _jwtSettings = jwtSettings;
    }

    public TokenValidationParameters tokenValidationParameters
    {
        get
        {
            return new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = _jwtSettings.Issuer,
                ValidateAudience = true,
                ValidAudience = _jwtSettings.Audience,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey!)),
                ClockSkew = TimeSpan.Zero
            };
        }
    }
}