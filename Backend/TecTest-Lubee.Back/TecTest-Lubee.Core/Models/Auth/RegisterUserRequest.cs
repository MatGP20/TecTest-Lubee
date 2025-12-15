namespace TecTest_Lubee.Core.Models.Auth
{
    public class RegisterUserRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Admin";
    }
}
