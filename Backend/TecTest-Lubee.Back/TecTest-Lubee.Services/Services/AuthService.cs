using Microsoft.EntityFrameworkCore;
using TecTest_Lubee.Core.Models.Auth;
using TecTest_Lubee.Data.Interface;
using TecTest_Lubee.Services.Factories;
using TecTest_Lubee.Services.Interfaces;

namespace TecTest_Lubee.Services;

public class AuthService : IAuthService
{
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IPasswordHasher _passwordHasher; 
    protected readonly IDbContextServiceFactory _contextFactory;

    public AuthService(
        IJwtTokenService jwtTokenService,
        IDbContextServiceFactory contextFactory,
        IPasswordHasher passwordHasher)
    {
        _jwtTokenService = jwtTokenService;
        _contextFactory = contextFactory;
        _passwordHasher = passwordHasher;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        using (var context = _contextFactory.CreateDbContext()) 
        {
            var user = await context.Users.AsNoTracking()
                .Where(u => u.Username == request.Username)
                .FirstOrDefaultAsync(cancellationToken);

            if (user is null || !user.IsActive)
            {
                return null;
            }

            var isValid = _passwordHasher.VerifyHashedPassword(user.PasswordHash, request.Password, user.Username);

            if (!isValid)
            {
                return null;
            }

            var token = _jwtTokenService.GenerateToken(user);
            var expiresAtUtc = DateTime.UtcNow.Add(_jwtTokenService.ExpiresIn);

            return new LoginResponse(token, expiresAtUtc, user.Username, user.Role);
        }
            
    }
}
