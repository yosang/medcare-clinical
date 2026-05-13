using System.Text;
using Data.JWT;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
public static class JWTExtension
{
    public static IServiceCollection AddJWTConfig(this IServiceCollection service, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetRequiredSection("JwtSettings").Get<JWTSettings>() ?? throw new InvalidOperationException("Unable to retrieve JWT settings, make sure appsettings.json is configured!");

        if(string.IsNullOrWhiteSpace(jwtSettings.Issuer)) throw new InvalidOperationException("JWT Issuer is missing from appsettings.json");
        if(string.IsNullOrWhiteSpace(jwtSettings.Audience)) throw new InvalidOperationException("JWT Audience is missing from appsettings.json");
        if(!jwtSettings.ExpiryMinutes.HasValue) throw new InvalidOperationException("JWT ExpiryMinutes is missing from appsettings.json");
        if(string.IsNullOrWhiteSpace(jwtSettings.SecretKey)) throw new InvalidOperationException("JWT Secret key is missing from appsettings.json");

        service.AddSingleton(jwtSettings);

        service.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwtSettings.Issuer,
                        ValidateAudience = true,
                        ValidAudience = jwtSettings.Audience,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey!))
                    };
                });

        service.AddHttpContextAccessor(); // Used to retrieve token claims
        service.AddAuthorization();
        return service;
    }

    public static WebApplication UseJWTMiddlewares(this WebApplication app)
    {
        app.UseAuthentication();
        app.UseAuthorization();

        return app;
    }
}