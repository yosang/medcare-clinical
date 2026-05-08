using ErrorHandling;
using Extensions; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabaseConfig(builder.Configuration)
                .AddServices()
                .AddExceptionHandler<GlobalExceptionHandler>()
                .AddProblemDetails()
                .AddControllers();

var app = builder.Build();

app.UseExceptionHandler();
app.MapControllers();

app.MapGet("/", () => "Hello World!");

app.Run();
