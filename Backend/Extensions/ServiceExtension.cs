using Services;

public static class ServiceExtension
{
    public static IServiceCollection AddServices(this IServiceCollection service)
    {
        service.AddScoped<CityService>()
                .AddScoped<SpecialtyService>();

        return service;
    }
}