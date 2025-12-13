using TecTest_Lubee.Core.Interfaces;
using TecTest_Lubee.Core.Models.Auth;

namespace TecTest_Lubee.Services;

public class AuthService : IAuthService
{
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public AuthService(
        IJwtTokenService jwtTokenService,
        IUserRepository userRepository,
        IPasswordHasher passwordHasher)
    {
        _jwtTokenService = jwtTokenService;
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByUsernameAsync(request.Username, cancellationToken);

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
