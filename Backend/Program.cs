using Extensions; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabaseConfig(builder.Configuration)
                .AddServices()
                .AddControllers();

var app = builder.Build();

app.UseExceptionHandler("/error");
app.MapControllers();

app.MapGet("/", () => "Hello World!");

app.Run();
