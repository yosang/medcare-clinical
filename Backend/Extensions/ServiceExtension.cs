using Services;
public static class ServiceExtension
{
    public static IServiceCollection AddServices(this IServiceCollection service)
    {
        service.AddScoped<CityService>()
                .AddScoped<SpecialtyService>()
                .AddScoped<StatusService>()
                .AddScoped<CategoryService>()
                .AddScoped<DoctorService>()
                .AddScoped<AppointmentService>()
                .AddScoped<PatientService>()
                .AddScoped<ClinicService>();

        return service;
    }
}