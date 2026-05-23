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

    public async Task<TokenDTO?> Login(LoginPatientDTO dto)
    {
        var existing = await _ctx.Patients.AsNoTracking()
                                    .Where(p => p.Email == dto.Email)
                                    .FirstOrDefaultAsync();

        if(existing == null) return null;

        var isPasswordValid = _passwordHasher.VerifyHashedPassword(null!, existing.PasswordHash!, dto.Password);
        
        if(isPasswordValid == PasswordVerificationResult.Failed) return null;

        return new TokenDTO { Token = _ts.GenerateToken(existing)};
    }
    public async Task<TokenDTO?> Register(RegisterPatientDTO dto)
    {
        var existing = await _ctx.Patients.AsNoTracking()
                                            .Where(p => p.Email == dto.Email || p.NationalIdentityNumber == dto.NationalIdentityNumber)
                                            .FirstOrDefaultAsync();
        if(existing != null) return null;

        var newPatient = dto.ToPatient();

        newPatient.PasswordHash = _passwordHasher.HashPassword(null!, dto.Password!);
        newPatient.IsRegistered = true;

        _ctx.Patients.Add(newPatient);

        await _ctx.SaveChangesAsync();

        var token = _ts.GenerateToken(newPatient);

        return new TokenDTO { Token = token};
    }
}