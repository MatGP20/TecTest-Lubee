using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TecTest_Lubee.Data.Entities;
using TecTest_Lubee.Services.Interfaces;

namespace TecTest_Lubee.WebAPI.Controllers
{
    [Route("api/inmueble/{propertyId:guid}/images")]
    [ApiController]
    [ApiVersion("1.0")]
    [Authorize("Admin")]
    public class PropertyImageController : ControllerBase
    {
        private readonly IPropertyImageService _propertyImageService;
        private readonly ILogger<PropertyImageController> _logger;

        public PropertyImageController(IPropertyImageService propertyImageService, ILogger<PropertyImageController> logger)
        {
            _propertyImageService = propertyImageService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PropertyImage>>> GetImages(Guid propertyId)
        {
            try
            {
                _logger.LogInformation("Listando imágenes para inmueble {InmuebleId}", propertyId);
                var images = await _propertyImageService.GetAllByPropertyAsync(propertyId);
                if (images == null || !images.Any())
                {
                    _logger.LogWarning("No se encontraron imágenes para inmueble {InmuebleId}", propertyId);
                    return NotFound();
                }
                return Ok(images);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener imágenes para inmueble {InmuebleId}", propertyId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener las imágenes");
            }
            
        }

        [HttpPost]
        public async Task<IActionResult> AddImage(Guid propertyId, [FromBody] PropertyImage image)
        {
            try
            {
                _logger.LogInformation("Agregando imagen a inmueble {InmuebleId}", propertyId);
                image.InmuebleId = propertyId;
                var created = await _propertyImageService.CreateAsync(image);
                if (!created)
                {
                    _logger.LogError("No se pudo crear la imagen para inmueble {InmuebleId}", propertyId);
                    return StatusCode(StatusCodes.Status500InternalServerError, "No se pudo crear la imagen");
                }
                return CreatedAtAction(nameof(GetImages), new { propertyId }, image);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al agregar imagen para inmueble {InmuebleId}", propertyId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al agregar la imagen");
            }
            
        }

        [HttpPut("{imageId:guid}")]
        public async Task<IActionResult> UpdateImage(Guid propertyId, Guid imageId, [FromBody] PropertyImage image)
        {
            try
            {
                _logger.LogInformation("Actualizando imagen {ImageId} de inmueble {InmuebleId}", imageId, propertyId);
                image.InmuebleId = propertyId;
                var updated = await _propertyImageService.UpdateAsync(imageId, image);
                if (!updated)
                {
                    _logger.LogWarning("No se encontró imagen {ImageId} de inmueble {InmuebleId} para actualizar", imageId, propertyId);
                    return NotFound();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar imagen {ImageId} de inmueble {InmuebleId}", imageId, propertyId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar la imagen");
            }
        }

        [HttpDelete("{imageId:guid}")]
        public async Task<IActionResult> DeleteImage(Guid propertyId, Guid imageId)
        {
            try
            {
                _logger.LogInformation("Eliminando imagen {ImageId} de inmueble {InmuebleId}", imageId, propertyId);
                var deleted = await _propertyImageService.ToggleActivated(imageId);
                if (!deleted)
                {
                    _logger.LogWarning("No se encontró imagen {ImageId} de inmueble {InmuebleId} para eliminar", imageId, propertyId);
                    return NotFound();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar imagen {ImageId} de inmueble {InmuebleId}", imageId, propertyId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar la imagen");
            }
        }
    }
}
