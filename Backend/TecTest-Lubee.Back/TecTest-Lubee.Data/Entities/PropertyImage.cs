namespace TecTest_Lubee.Data.Entities
{
    public class PropertyImage : BaseEntity
    {
        public Guid InmuebleId { get; set; }
        public Inmueble Inmueble { get; set; } = null!;
        public string ImageUrl { get; set; } = string.Empty;
        public string ContentType { get; set; } = "image/jpg";
        public long SizeInBytes { get; set; }
        public int Order { get; set; }
        public bool IsPrimary { get; set; }
    }
}
