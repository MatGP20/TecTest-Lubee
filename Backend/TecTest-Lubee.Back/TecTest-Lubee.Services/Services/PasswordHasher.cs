using System.Security.Cryptography;
using System.Text;
using TecTest_Lubee.Core.Interfaces;

namespace TecTest_Lubee.Services;

public class PasswordHasher : IPasswordHasher
{
    public string HashPassword(string password, string salt)
    {
        var bytes = Encoding.UTF8.GetBytes($"{salt}:{password}");
        var hash = SHA256.HashData(bytes);
        return Convert.ToBase64String(hash);
    }

    public bool VerifyHashedPassword(string hashedPassword, string providedPassword, string salt)
    {
        var providedHash = HashPassword(providedPassword, salt);
        return CryptographicOperations.FixedTimeEquals(
            Convert.FromBase64String(hashedPassword),
            Convert.FromBase64String(providedHash));
    }
}
