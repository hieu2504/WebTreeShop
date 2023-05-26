using System.ComponentModel.DataAnnotations;

namespace TreeShop.Api.MappingModel
{
    public class OrderProductMapping
    {
        public int ProductId { get; set; }
        public string Title { get; set; }
        public string Code { get; set; }
        public int? Price { get; set; }
        public double? Discount { get; set; }
        public int? Quantity { get; set; }
        public int? Total { get; set; }
    }
}
