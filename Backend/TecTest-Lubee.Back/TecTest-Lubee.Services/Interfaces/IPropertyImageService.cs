using TecTest_Lubee.Data.Entities;

namespace TecTest_Lubee.Services.Interfaces
{
    public interface IPropertyImageService
    {
        Task<List<PropertyImage>> GetAllByPropertyAsync(Guid inmuebleId);
        Task<bool> CreateAsync(PropertyImage propertyImage);
        Task<bool> UpdateAsync(Guid id, PropertyImage updatedPropertyImage);
        Task<bool> ToggleActivated(Guid id);
    }
}
