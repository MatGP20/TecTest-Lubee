using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TecTest_Lubee.Services.Interfaces;
using TecTest_Lubee.Core.Models.Auth;


namespace TecTest_Lubee.WebAPI.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IAuthService authService,
            ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
        {
            var response = await _authService.LoginAsync(request, cancellationToken);

            if (response is null)
            {
                _logger.LogWarning($"Intento de login fallido para el usuario {request.Username}");
                return Unauthorized();
            }

            return Ok(response);
        }

        [HttpPost("users")]
        [Authorize("Admin")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> CreateUser([FromBody] RegisterUserRequest request, CancellationToken cancellationToken)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest("Username y Password son obligatorios.");
                }

                _logger.LogInformation("Creando usuario {Username}", request.Username);
                var user = await _authService.RegisterAsync(request, cancellationToken);
                if (user is null)
                {
                    _logger.LogWarning("El usuario {Username} ya existe", request.Username);
                    return Conflict($"El usuario {request.Username} ya existe.");
                }

                return CreatedAtAction(nameof(CreateUser), new { id = user.Id }, new { user.Id, user.Username, user.Role });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear usuario {Username}", request.Username);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear usuario");
            }
        }
    }
}
