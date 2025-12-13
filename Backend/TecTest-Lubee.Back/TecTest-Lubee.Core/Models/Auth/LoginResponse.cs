namespace TecTest_Lubee.Core.Models.Auth;

public record LoginResponse(string AccessToken, DateTime ExpiresAtUtc, string Username, string Role);
