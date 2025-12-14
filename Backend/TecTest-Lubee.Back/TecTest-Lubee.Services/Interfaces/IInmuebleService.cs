using TecTest_Lubee.Data.Entities;

namespace TecTest_Lubee.Services.Interfaces
{
    public interface IInmuebleService
    {
        Task<List<Inmueble>> GetAllAsync(bool isOnlyActive);
        Task<Inmueble?> GetByIdAsync(Guid id);
        Task<bool> CreateAsync(Inmueble inmueble);
        Task<bool> UpdateAsync(Guid id, Inmueble updatedInmueble);
        Task<bool> ToggleActive(Guid id, bool isActivated);
    }
}
