using TecTest_Lubee.Data.Entities;

namespace TecTest_Lubee.Services.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
    TimeSpan ExpiresIn { get; }
}
