using Context;
using Microsoft.EntityFrameworkCore;

namespace Extensions;

public static class DatabaseExtension
{
    public static IServiceCollection AddDatabaseConfig(this IServiceCollection service, IConfiguration config)
    {
        var conStr = config.GetConnectionString("default") ?? throw new Exception("Unable to retrieve connection string, make sure appsettings.json is configured!");
        service.AddDbContext<DatabaseContext>(options => options.UseMySQL(conStr));
        return service;
    }
}