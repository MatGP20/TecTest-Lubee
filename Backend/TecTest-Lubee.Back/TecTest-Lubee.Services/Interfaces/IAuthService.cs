using TecTest_Lubee.Core.Models.Auth;
using TecTest_Lubee.Data.Entities;

namespace TecTest_Lubee.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<User?> RegisterAsync(RegisterUserRequest request, CancellationToken cancellationToken = default);
}
