using TecTest_Lubee.Data.Entities;

namespace TecTest_Lubee.Services.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default);
}
