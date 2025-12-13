using TecTest_Lubee.Data.Entities;

namespace TecTest_Lubee.Core.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default);
}
