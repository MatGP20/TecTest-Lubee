using Microsoft.Extensions.Configuration;
using TecTest_Lubee.Data;

namespace TecTest_Lubee.Services.Factories
{
    public class DbContextServiceFactory : IDbContextServiceFactory
    {
        private readonly IConfiguration _configuration;
        public DbContextServiceFactory(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public TTLDbContext CreateDbContext()
        {
            return TTLDbContext.GetNewDataContext(_configuration);
        }
    }
}
