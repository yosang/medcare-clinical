namespace Extensions;
public static class CorsConfigExtension
{
    public static IServiceCollection AddCorsConfig(this IServiceCollection service, IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetSection("AllowedOrigins").Get<string[]>() ?? ["http://localhost:5173"];

        service.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy
                        .WithOrigins(allowedOrigins)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
            });

        });

        return service;
    }

    public static WebApplication UseCorsMiddleware(this WebApplication app)
    {
        app.UseCors("AllowFrontend");
        app.Logger.LogWarning("App is CORS configured for Development only");
        return app;
    }
}