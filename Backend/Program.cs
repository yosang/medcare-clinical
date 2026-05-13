using ErrorHandling;
using Extensions; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabaseConfig(builder.Configuration)
                .AddCorsConfig()
                .AddServices()
                .AddSwagger()
                .AddExceptionHandler<GlobalExceptionHandler>()
                .AddProblemDetails()
                .AddControllers();

var app = builder.Build();

app.UseExceptionHandler();
app.UseCorsMiddleware();
app.UseSwaggerMiddlewares();
app.MapControllers();

app.MapGet("/", () => "Visit the /doc endpoint for documentation");

app.Run();
