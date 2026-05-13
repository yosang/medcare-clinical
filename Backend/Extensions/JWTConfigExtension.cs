using Data.JWT;
public static class JWTExtension
{
    public static IServiceCollection AddJWTConfig(this IServiceCollection service, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetRequiredSection("JwtSettings").Get<JWTSettings>() ?? throw new InvalidOperationException("Unable to retrieve JWT settings, make sure appsettings.json is configured!");

        Console.WriteLine(jwtSettings);

        service.AddSingleton(jwtSettings);

        return service;
    }
}