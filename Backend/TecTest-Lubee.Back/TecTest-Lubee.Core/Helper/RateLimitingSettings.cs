namespace TecTest_Lubee.Core.Helper
{
    public class RateLimitingSettings
    {
        public int PermitLimit { get; set; } = 500;
        public int WindowMinutes { get; set; } = 1;
        public int QueueLimit { get; set; } = 0;

        public static RateLimitingSettings Default() => new();
    }
}
