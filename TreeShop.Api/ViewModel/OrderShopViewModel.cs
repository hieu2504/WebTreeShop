using TreeShop.Api.Data;

namespace TreeShop.Api.ViewModel
{
    public class OrderShopViewModel
    {
        public int? ProductId { get; set; }
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? CategoryName { get; set; }
        public string? Description { get; set; }
        public int? CatId { get; set; }
        public int? Price { get; set; }
        public double? Discount { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool? BestSellers { get; set; }
        //public bool HomeFlag { get; set; }
        public bool? IsActive { get; set; }
        public string? Tags { get; set; }
        public string? Title { get; set; }
        public int? Quantity { get; set; }
        public int OrderQuantity { get; set; }
        public List<ProductImage>? ProductImages { get; set; }
    }
}
