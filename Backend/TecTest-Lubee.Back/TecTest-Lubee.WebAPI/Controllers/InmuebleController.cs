using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TecTest_Lubee.Services.Interfaces;
using TecTest_Lubee.Data.Entities;

namespace TecTest_Lubee.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    [Authorize] // policies por acción
    public class InmuebleController : ControllerBase
    {
        protected readonly IInmuebleService _inmuebleService;
        private readonly ILogger<InmuebleController> _logger;

        public InmuebleController(
            IInmuebleService inmuebleService,
            ILogger<InmuebleController> logger)
        {
            _inmuebleService = inmuebleService;
            _logger = logger;
        }

        [HttpGet]
        [Authorize("User")]
        public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = false)
        {
            try
            {
                _logger.LogInformation("Listando inmuebles. includeInactive={IncludeInactive}", includeInactive);
                var inmuebles = await _inmuebleService.GetAllAsync(!includeInactive);
                if (inmuebles == null || !inmuebles.Any())
                {
                    _logger.LogWarning("No se encontraron inmuebles");
                    return NotFound("No se encontraron inmuebles");
                }
                return Ok(inmuebles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al listar inmuebles");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al listar inmuebles");
            }
        }

        [HttpGet("{id:guid}")]
        [Authorize("User")]
        public async Task<ActionResult> Get(Guid id)
        {
            try
            {
                _logger.LogInformation("Obteniendo inmueble {InmuebleId}", id);
                var inmueble = await _inmuebleService.GetByIdAsync(id);
                if (inmueble is null)
                {
                    _logger.LogWarning("Inmueble {InmuebleId} no encontrado", id);
                    return NotFound();
                }
                return Ok(inmueble); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener inmueble {InmuebleId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener inmueble");
            }            
        }

        [HttpPost]
        [Authorize("Admin")]
        public async Task<IActionResult> Post([FromBody] Inmueble inmueble)
        {
            try{
                _logger.LogInformation("Creando inmueble nuevo");
                var created = await _inmuebleService.CreateAsync(inmueble);
                if (!created)
                {
                    _logger.LogError("No se pudo crear el inmueble");
                    return StatusCode(StatusCodes.Status500InternalServerError, "No se pudo crear el inmueble");
                }
                return CreatedAtAction(nameof(Get), new { id = inmueble.Id }, inmueble);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear inmueble");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear inmueble");
            }
        }

        [HttpPut("{id:guid}")]
        [Authorize("Admin")]
        public async Task<IActionResult> Put(Guid id, [FromBody] Inmueble inmueble)
        {
            try{
            _logger.LogInformation("Actualizando inmueble {InmuebleId}", id);
            var updated = await _inmuebleService.UpdateAsync(id, inmueble);
            if (!updated)
            {
                _logger.LogWarning("No se encontró inmueble {InmuebleId} para actualizar", id);
                return NotFound();
            }
            return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar inmueble {InmuebleId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar inmueble");
            }
        }

        [HttpPatch("{id:guid}/activation")]
        [Authorize("Admin")]
        public async Task<IActionResult> ToggleActivation(Guid id, [FromQuery] bool isActive)
        {
            try
            {
                _logger.LogInformation("Cambiando estado de inmueble {InmuebleId} a {IsActive}", id, isActive);
                var toggled = await _inmuebleService.ToggleActive(id, isActive);
                if (!toggled)
                {
                    _logger.LogWarning("No se encontró inmueble {InmuebleId} para cambiar estado", id);
                    return NotFound();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al cambiar estado de inmueble {InmuebleId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al cambiar estado de inmueble");
            }
        }

        [HttpDelete("{id:guid}")]
        [Authorize("Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                _logger.LogInformation("Desactivando inmueble {InmuebleId}", id);
                var toggled = await _inmuebleService.ToggleActive(id, false);
                if (!toggled)
                {
                    _logger.LogWarning("No se encontró inmueble {InmuebleId} para desactivar", id);
                    return NotFound();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al desactivar inmueble {InmuebleId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al desactivar inmueble");
            }
        }
    }
}
