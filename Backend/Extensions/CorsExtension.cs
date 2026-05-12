namespace Extensions;

public static class CorsConfigExtension
{
    public static IServiceCollection AddCorsConfig(this IServiceCollection service)
    {
        service.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            });

            // This is default setup for development, for production we would have to add origins with the extention ".WithOrigins"
        });

        return service;
    }

    public static WebApplication UseCorsMiddleware(this WebApplication app)
    {
        app.UseCors();
        app.Logger.LogWarning("App is CORS configured for Development only");
        return app;
    }
}