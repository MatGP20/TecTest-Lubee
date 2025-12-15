using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.Reflection;

namespace TecTest_Lubee.Data
{
    public class TtlDbContextFactory : IDesignTimeDbContextFactory<TTLDbContext>
    {
        public TTLDbContext CreateDbContext(string[] args)
        {
            var basePath = Directory.GetCurrentDirectory();

            // Busca configuración en el proyecto actual y, si no existe, intenta el de WebAPI.
            var configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
                .AddJsonFile(Path.Combine("..", "TecTest-Lubee.WebAPI", "appsettings.json"), optional: true, reloadOnChange: false)
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException("DefaultConnection no está configurado.");
            }

            var optionsBuilder = new DbContextOptionsBuilder<TTLDbContext>();
            optionsBuilder.UseSqlServer(connectionString, opts =>
            {
                opts.EnableRetryOnFailure(10, TimeSpan.FromSeconds(5), null);
                opts.MigrationsAssembly(typeof(TTLDbContext).GetTypeInfo().Assembly.GetName().Name);
            });

            return new TTLDbContext(optionsBuilder.Options);
        }
    }
}
