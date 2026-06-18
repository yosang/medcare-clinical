using System.Text.Json.Serialization;
using ErrorHandling;
using Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCorsConfig(builder.Configuration)
                .AddDatabaseConfig(builder.Configuration)
                .AddJWTConfig(builder.Configuration)
                .AddServices()
                .AddExceptionHandler<GlobalExceptionHandler>()
                .AddSwagger()
                .AddProblemDetails()
                .AddControllers()
                .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter())); // Converts ENUMs to strings

var app = builder.Build();

app.ApplyMigrations();
app.UseExceptionHandler();
app.UseCorsMiddleware();
app.UseJWTMiddlewares();
app.UseSwaggerMiddlewares();
app.MapControllers();

app.MapGet("/", () => "Visit the /doc endpoint for documentation");

app.Run();
