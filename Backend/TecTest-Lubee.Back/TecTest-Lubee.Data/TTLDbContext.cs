using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Reflection.Emit;
using TecTest_Lubee.Data.Entities;
using TecTest_Lubee.Data.Seeds;

namespace TecTest_Lubee.Data
{
    public class TTLDbContext: DbContext
    {
        private readonly IConfiguration _configuration;
        public static TTLDbContext GetNewDataContext(IConfiguration configuration)
        {
            return new TTLDbContext(configuration);
        }

        public TTLDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Inmueble> Inmuebles { get; set; }
        public DbSet<PropertyImage> PropertyImages { get; set; }

        //Para migrar, descomentar este constructor
        public TTLDbContext(DbContextOptions<TTLDbContext> options) : base(options)
        {
        }

        //Para migrar, comentar este método
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
           base.OnConfiguring(optionsBuilder);
           // Solo configura si no viene ya configurado (p.ej. desde la factory) y hay configuración disponible
           if (optionsBuilder.IsConfigured || _configuration is null)
           {
               return;
           }
           optionsBuilder.EnableSensitiveDataLogging()
                         .EnableDetailedErrors()
                         .UseSqlServer(_configuration.GetConnectionString("DefaultConnection"), opts => opts.EnableRetryOnFailure(10, TimeSpan.FromSeconds(5), null));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasKey(x=> x.Id);

            modelBuilder.Entity<Inmueble>()
                .HasKey(x => x.Id);

            modelBuilder.Entity<PropertyImage>()
                .HasOne(x => x.Inmueble)
                .WithMany(y => y.Images)
                .HasForeignKey(x => x.InmuebleId)
                .OnDelete(DeleteBehavior.Cascade);            
        }
    }
}
