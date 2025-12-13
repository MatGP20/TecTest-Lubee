using TecTest_Lubee.Data.Entities;

namespace TecTest_Lubee.Core.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
    TimeSpan ExpiresIn { get; }
}
