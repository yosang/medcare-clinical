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

    public async Task<TokenDTO?> Register(RegisterPatientDTO dto)
    {
        var existing = await _ctx.Patients.AsNoTracking()
                                            .Where(p => p.Email == dto.Email)
                                            .FirstOrDefaultAsync();
        if(existing != null) return null;

        var newPatient = dto.ToPatient();

        newPatient.PasswordHash = _passwordHasher.HashPassword(null!, dto.Password!);

        _ctx.Patients.Add(newPatient);

        await _ctx.SaveChangesAsync();

        var token = _ts.GenerateToken(newPatient);

        return new TokenDTO { Token = token};
    }
}