using Microsoft.EntityFrameworkCore;
using TecTest_Lubee.Data.Entities;
using TecTest_Lubee.Services.Factories;
using TecTest_Lubee.Services.Interfaces;

namespace TecTest_Lubee.Services.Services
{
    public class PropertyImageService : IPropertyImageService
    {
        protected readonly IDbContextServiceFactory _contextFactory;

        public PropertyImageService(IDbContextServiceFactory contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public async Task<List<PropertyImage>> GetAllByPropertyAsync(Guid inmuebleId)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                return await context.PropertyImages.AsNoTracking()
                    .Where(pi => pi.InmuebleId == inmuebleId)
                    .ToListAsync();
            }
        }

        public async Task<bool> CreateAsync(PropertyImage propertyImage)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                context.PropertyImages.Add(propertyImage);
                await context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> UpdateAsync(Guid id, PropertyImage updatedPropertyImage)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                var existingImage = await context.PropertyImages.FindAsync(id);
                if (existingImage == null)
                {
                    return false;
                }

                existingImage.ImageUrl = updatedPropertyImage.ImageUrl;
                existingImage.IsPrimary = updatedPropertyImage.IsPrimary;
                existingImage.Order = updatedPropertyImage.Order;
                existingImage.SizeInBytes = updatedPropertyImage.SizeInBytes;
                existingImage.ContentType = updatedPropertyImage.ContentType;
                existingImage.InmuebleId = updatedPropertyImage.InmuebleId;

                context.PropertyImages.Update(existingImage);
                await context.SaveChangesAsync();

                return true;
            }
        }

        public async Task<bool> ToggleActivated(Guid id)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                var existingImage = await context.PropertyImages.FindAsync(id);
                if (existingImage == null)
                {
                    return false;
                }

                context.PropertyImages.Remove(existingImage);
                await context.SaveChangesAsync();
                return true;
            }
        }
    }
}
