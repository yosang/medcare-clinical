using System.ComponentModel;
using Data.Context;
using DTOS;
using Extensions.Mappers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
public class AuthService
{
    private readonly PasswordHasher<object> _passwordHasher;
    private readonly DatabaseContext _ctx;
    private readonly TokenService _ts;

    public AuthService(PasswordHasher<object> passwordHasher, DatabaseContext context, TokenService tokenService)
    {
        _passwordHasher = passwordHasher;
        _ctx = context;
        _ts = tokenService;
    }

    /// <summary> Authenticates an existing patient </summary>
    /// <param name="dto"></param>
    /// <returns> Access token </returns>
    public async Task<TokenDTO?> Login(LoginPatientDTO dto)
    {
        var existing = await _ctx.Patients.AsNoTracking()
                                    .Where(p => p.Email == dto.Email)
                                    .FirstOrDefaultAsync();

        if(existing == null) return null;

        var isPasswordValid = _passwordHasher.VerifyHashedPassword(null!, existing.PasswordHash!, dto.Password);
        
        if(isPasswordValid == PasswordVerificationResult.Failed) return null;

        var access_token = _ts.GenerateAccessToken(existing);
        var refresh_token = _ts.GenerateRefreshToken(existing);

        return new TokenDTO { accessToken = access_token, refreshToken = refresh_token};
    }

    /// <summary> Registers a new patient with credentials </summary>
    /// <param name="dto"></param>
    /// <returns> Boolean representation of registration result  </returns>
    public async Task<bool> Register(RegisterPatientDTO dto)
    {
        var existing = await _ctx.Patients.AsNoTracking()
                                            .Where(p => p.Email == dto.Email || p.NationalIdentityNumber == dto.NationalIdentityNumber)
                                            .FirstOrDefaultAsync();
        if(existing != null) return false;

        var newPatient = dto.ToPatient();

        newPatient.PasswordHash = _passwordHasher.HashPassword(null!, dto.Password!);
        newPatient.IsRegistered = true;

        _ctx.Patients.Add(newPatient);

        await _ctx.SaveChangesAsync();

        return true;
    }

    /// <summary> Generates a new access token for a specific patient </summary>
    /// <param name="patientId"></param>
    /// <returns> Access token </returns>
    public async Task<TokenDTO?> RefreshToken(int patientId)
    {
        var existing = await _ctx.Patients.AsNoTracking()
                                            .Where(p => p.Id == patientId)
                                            .FirstOrDefaultAsync();

        if(existing == null) return null;

        var access_token = _ts.GenerateAccessToken(existing);

        return new TokenDTO { accessToken = access_token };
    }
}