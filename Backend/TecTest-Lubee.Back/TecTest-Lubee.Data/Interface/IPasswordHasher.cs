namespace TecTest_Lubee.Data.Interface;

public interface IPasswordHasher
{
    string HashPassword(string password, string salt);
    bool VerifyHashedPassword(string hashedPassword, string providedPassword, string salt);
}
