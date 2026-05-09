using Microsoft.OpenApi;

public static class AddSwaggerExtension
{
    public static IServiceCollection AddSwagger(this IServiceCollection service)
    {
        service.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo()
            {
               Title = "Medical Booking API",
               Version = "v1",
               Description = "An ASP.NET Core API to manage patient booking on medical clinics" 
            });
        });

        return service;
    }

    public static WebApplication UseSwaggerMiddlewares(this WebApplication app)
    {
        if(app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        return app;
    }
}