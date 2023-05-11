using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TreeShop.Api.ViewModel
{
    public class ProductViewModel
    {
        public int? ProductId { get; set; }
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? CatId { get; set; }
        public int? Price { get; set; }
        public int? Discount { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool? BestSellers { get; set; }
        //public bool HomeFlag { get; set; }
        public bool? IsActive { get; set; }
        public string? Tags { get; set; }
        public string? Title { get; set; }
        public int? Quantity { get; set; }
        public List<IFormFile>? lstFiles { get; set; }
        public string? lstProImage { get; set; }
    }

   
}
