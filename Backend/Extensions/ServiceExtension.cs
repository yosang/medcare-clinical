using Microsoft.AspNetCore.Identity;
using Services;
public static class ServiceExtension
{
    public static IServiceCollection AddServices(this IServiceCollection service)
    {
        // Data related services
        service.AddScoped<CityService>()
                .AddScoped<SpecialtyService>()
                .AddScoped<StatusService>()
                .AddScoped<CategoriesService>()
                .AddScoped<DoctorService>()
                .AddScoped<AppointmentService>()
                .AddScoped<PatientService>()
                .AddScoped<ClinicService>();

        // Auth related services
        service.AddScoped<PasswordHasher<object>>()
                .AddScoped<TokenService>()
                .AddScoped<AuthService>();

        return service;
    }
}