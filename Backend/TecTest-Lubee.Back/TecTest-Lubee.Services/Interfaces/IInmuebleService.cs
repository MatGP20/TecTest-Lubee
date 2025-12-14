using TecTest_Lubee.Data.Entities;

namespace TecTest_Lubee.Services.Interfaces
{
    public interface IInmuebleService
    {
        Task<List<Inmueble>> GetAllAsync(bool isComplete);
        Task<Inmueble?> GetByIdAsync(Guid id);
        Task<List<Inmueble>> CreateAsync(Inmueble inmueble);
        Task<List<Inmueble>?> UpdateAsync(Guid id, Inmueble updatedInmueble);
        Task<List<Inmueble>?> ToggleActive(Guid id, bool isActivated);
    }
}
