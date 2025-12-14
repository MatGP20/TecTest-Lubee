using Microsoft.EntityFrameworkCore;
using System.Linq;
using TecTest_Lubee.Data.Entities;
using TecTest_Lubee.Services.Factories;
using TecTest_Lubee.Services.Interfaces;

namespace TecTest_Lubee.Services.Services
{
    public class InmuebleService : IInmuebleService
    {

        protected readonly IDbContextServiceFactory _contextFactory;

        public InmuebleService(IDbContextServiceFactory contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public async Task<List<Inmueble>> GetAllAsync(bool isComplete)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                var inmueblesQuery = context.Inmuebles.AsNoTracking();

                if (isComplete)
                {
                    inmueblesQuery = inmueblesQuery.Where(i => i.IsActive);
                }

                inmueblesQuery = inmueblesQuery.Include(pi => pi.Images);

                return await inmueblesQuery.ToListAsync();
            }
        }

        public async Task<Inmueble?> GetByIdAsync(Guid id)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                return await context.Inmuebles.AsNoTracking()
                    .Where(i => i.IsActive)
                    .Include(i => i.Images)
                    .FirstOrDefaultAsync(i => i.Id == id);
            }
        }

        public async Task<List<Inmueble>> CreateAsync(Inmueble inmueble)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                context.Inmuebles.Add(inmueble);
                await context.SaveChangesAsync();
                return await GetAllAsync(true);
            }
        }

        public async Task<List<Inmueble>?> UpdateAsync(Guid id, Inmueble updatedInmueble)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                var inmueble = await context.Inmuebles
                    .Include(i => i.Images)
                    .FirstOrDefaultAsync(i => i.Id == id);
                if (inmueble == null)
                {
                    return null;
                }
                inmueble.Description = updatedInmueble.Description;
                inmueble.Location = updatedInmueble.Location;
                inmueble.PropertyType = updatedInmueble.PropertyType;
                inmueble.Rooms = updatedInmueble.Rooms;
                inmueble.Size = updatedInmueble.Size;
                inmueble.Antiquity = updatedInmueble.Antiquity;
                context.Inmuebles.Update(inmueble);
                await context.SaveChangesAsync();
                return await GetAllAsync(true);
            }
        }

        public async Task<List<Inmueble>?> ToggleActive(Guid id, bool isActivated)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                var inmueble = await context.Inmuebles
                    .FirstOrDefaultAsync(i => i.Id == id);
                if (inmueble == null)
                {
                    return null;
                }
                inmueble.IsActive = isActivated;
                context.Inmuebles.Update(inmueble);
                await context.SaveChangesAsync();
                return await GetAllAsync(true);
            }
        }
    }
}
