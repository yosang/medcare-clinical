namespace Data.JWT;
public class JWTSettings
{
    public string Issuer { get; init; } = string.Empty;
    public string Audience { get; init; } = string.Empty;
    public int? AccessTokenExpiryMinutes { get; init; }
    public int? RefreshTokenExpiryDays { get; init; }
    public string SecretKey { get; init; } = string.Empty;
}