using Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Extensions;

public static class DatabaseExtension
{
    public static IServiceCollection AddDatabaseConfig(this IServiceCollection service, IConfiguration config)
    {
        var conStr = config.GetConnectionString("default") ?? throw new InvalidOperationException("Unable to retrieve connection string, make sure appsettings.json is configured!");
        service.AddDbContext<DatabaseContext>(options => options.UseMySQL(conStr));
        return service;
    }

    public static IApplicationBuilder ApplyMigrations(this IApplicationBuilder app)
    {
        using (var scope = app.ApplicationServices.CreateScope())
        {
            var services = scope.ServiceProvider;
            try
            {
                var context = services.GetRequiredService<DatabaseContext>();
                context.Database.Migrate(); // This fires the EF migrations
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<DatabaseContext>>();
                logger.LogError(ex, "An error occurred while migrating the database.");
            }
        }
        return app;
    }
}