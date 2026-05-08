using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace ErrorHandling;
public class GlobalExceptionHandler: IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Unhandled exception at {time}", DateTime.UtcNow);

        // Set the status code to 500
        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;

        // Return a custom ProblemDetails object as JSON
        await httpContext.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Title = "Internal Server Error",
            Status = 500,
            Detail = "An unexpected error occurred"
        }, cancellationToken);

        return true;
    }
}