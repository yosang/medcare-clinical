using System.Reflection;
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
               Description = "An ASP.NET Core API to manage patient booking on medical clinics",
               Contact = new OpenApiContact
               {
                   Name = "Author",
                   Url = new Uri("https://github.com/yosang")
               }
            });

            options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"));
        });

        return service;
    }

    public static WebApplication UseSwaggerMiddlewares(this WebApplication app)
    {
        if(app.Environment.IsDevelopment())
        {
            app.UseSwagger(options =>
            {
                options.RouteTemplate = "doc/{documentName}/swagger.json";
            });

            app.UseSwaggerUI(options =>
            {
                options.RoutePrefix = "doc";
                options.SwaggerEndpoint("/doc/v1/swagger.json", "v1");
            });
        }

        return app;
    }
}