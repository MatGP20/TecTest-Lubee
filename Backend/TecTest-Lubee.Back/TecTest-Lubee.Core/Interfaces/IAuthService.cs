using TecTest_Lubee.Core.Models.Auth;

namespace TecTest_Lubee.Core.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
}
