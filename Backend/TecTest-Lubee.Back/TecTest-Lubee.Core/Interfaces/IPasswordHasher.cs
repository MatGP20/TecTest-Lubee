namespace TecTest_Lubee.Core.Interfaces;

public interface IPasswordHasher
{
    string HashPassword(string password, string salt);
    bool VerifyHashedPassword(string hashedPassword, string providedPassword, string salt);
}
