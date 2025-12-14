using TecTest_Lubee.Data;

namespace TecTest_Lubee.Services.Factories
{
    public interface IDbContextServiceFactory
    {
        TTLDbContext CreateDbContext();
    }
}