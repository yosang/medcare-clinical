namespace Data.JWT;
public class JWTSettings
{
    public string? Issuer { get; init; }
    public string? Audience { get; init; }
    public int ExpiryMinutes { get; init; }
    public string? SecretKey { get; init; }
}