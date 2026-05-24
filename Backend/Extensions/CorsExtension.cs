namespace Extensions;
public static class CorsConfigExtension
{
    public static IServiceCollection AddCorsConfig(this IServiceCollection service)
    {
        service.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy
                        .WithOrigins("http://localhost:5173")
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