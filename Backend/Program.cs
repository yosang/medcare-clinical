using ErrorHandling;
using Extensions; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCorsConfig()
                .AddDatabaseConfig(builder.Configuration)
                .AddJWTConfig(builder.Configuration)
                .AddServices()
                .AddExceptionHandler<GlobalExceptionHandler>()
                .AddSwagger()
                .AddProblemDetails()
                .AddControllers();

var app = builder.Build();

app.UseExceptionHandler();
app.UseCorsMiddleware();
app.UseJWTMiddlewares();
app.UseSwaggerMiddlewares();
app.MapControllers();

app.MapGet("/", () => "Visit the /doc endpoint for documentation");

app.Run();
