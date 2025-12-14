namespace TecTest_Lubee.Data.Entities
{
    public class Inmueble : BaseEntity
    {
        public string PropertyType { get; set; } = string.Empty;
        public string? OperationType { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public int Rooms { get; set; }
        public decimal Size { get; set; }
        public decimal? Antiquity { get; set; }
        public string? Location { get; set; } = string.Empty;
        public ICollection<PropertyImage>? Images { get; set; } = new List<PropertyImage>();
        public bool IsActive { get; set; } = true;
    }
}
