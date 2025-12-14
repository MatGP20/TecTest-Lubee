using TecTest_Lubee.Core.Models.Auth;

namespace TecTest_Lubee.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
}
