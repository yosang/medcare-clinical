using ErrorHandling;
using Extensions; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabaseConfig(builder.Configuration)
                .AddServices()
                .AddSwagger()
                .AddExceptionHandler<GlobalExceptionHandler>()
                .AddProblemDetails()
                .AddControllers();

var app = builder.Build();

app.UseExceptionHandler();
app.UseSwaggerMiddlewares();
app.MapControllers();

app.MapGet("/", () => "Visit the /doc endpoint for documentation");

app.Run();
