using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TecTest_Lubee.Core.Interfaces;
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

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
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
    }
}
