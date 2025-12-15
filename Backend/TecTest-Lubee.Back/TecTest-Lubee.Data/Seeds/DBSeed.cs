using TecTest_Lubee.Data.Interface;
using TecTest_Lubee.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace TecTest_Lubee.Data.Seeds
{
    public class DBSeed
    {
        private readonly TTLDbContext _dbContext;
        private readonly IPasswordHasher _passwordHasher;

        public DBSeed(TTLDbContext dbContext, IPasswordHasher passwordHasher)
        {
            _dbContext = dbContext;
            _passwordHasher = passwordHasher;
        }

        public async Task SeedAsync(CancellationToken cancellationToken = default)
        {
            await _dbContext.Database.MigrateAsync(cancellationToken);

            if (await _dbContext.Users.AnyAsync(cancellationToken))
            {
                return;
            }

            var admin = new User
            {
                Username = "admin",
                Role = "Admin",
                PasswordHash = _passwordHasher.HashPassword("Admin123!", "admin"),
                IsActive = true
            };

            var superUser = new User
            {
                Username = "superUser",
                Role = "Admin",
                PasswordHash = _passwordHasher.HashPassword("Super123!", "superUser"),
                IsActive = true
            };

            var user = new User
            {
                Username = "user",
                Role = "User",
                PasswordHash = _passwordHasher.HashPassword("User123!", "user"),
                IsActive = true
            };

            var property1 = new Inmueble 
            { 
                Id= new Guid(),
                Antiquity = 5, 
                Description = "Beautiful house", 
                Location = "City Center", 
                PropertyType = "House", 
                Rooms = 3, 
                Size = 120, 
                IsActive = true 
            };

            var property2 = new Inmueble
            {
                Id = new Guid(),
                Antiquity = 2, 
                Description = "Modern apartment", 
                Location = "Uptown", 
                PropertyType = "Apartment",
                OperationType = "Rent",
                Rooms = 2, 
                Size = 80, 
                IsActive = true
            };

            var property3 = new Inmueble
            {
                Id = new Guid(),
                Antiquity = 10, 
                Description = "Cozy cottage", 
                Location = "Suburbs", 
                PropertyType = "Cottage",
                OperationType = "Sale",
                Rooms = 4, 
                Size = 150, 
                IsActive = true                
            };

            var propertyImage1 = new PropertyImage
            {
                Inmueble = property2,
                InmuebleId = property2.Id,
                ImageUrl = "http://example.com/house1.jpg",
                ContentType = "image/jpeg",
                SizeInBytes = 150000,
                Order = 1,
                IsPrimary = true
            };

            var propertyImage2 = new PropertyImage
            {
                Inmueble = property2,
                InmuebleId = property2.Id,
                ImageUrl = "http://example.com/house2.jpg",
                ContentType = "image/jpeg",
                SizeInBytes = 120000,
                Order = 2,
                IsPrimary = false
            };

            var propertyImage3 = new PropertyImage
            {
                Inmueble = property3,
                InmuebleId = property3.Id,
                ImageUrl = "http://example.com/cottage1.jpg",
                ContentType = "image/jpeg",
                SizeInBytes = 180000,
                Order = 1,
                IsPrimary = true
            };

            await _dbContext.Users.AddAsync(admin, cancellationToken);
            await _dbContext.Users.AddAsync(superUser, cancellationToken);
            await _dbContext.Users.AddAsync(user, cancellationToken);
            await _dbContext.Inmuebles.AddAsync(property1, cancellationToken);
            await _dbContext.Inmuebles.AddAsync(property2, cancellationToken);
            await _dbContext.Inmuebles.AddAsync(property3, cancellationToken);
            await _dbContext.PropertyImages.AddAsync(propertyImage1, cancellationToken);
            await _dbContext.PropertyImages.AddAsync(propertyImage2, cancellationToken);
            await _dbContext.PropertyImages.AddAsync(propertyImage3, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
