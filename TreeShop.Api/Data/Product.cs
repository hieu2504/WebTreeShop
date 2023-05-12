using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.Data
{
    [Table("Products")]
    public partial class Product
    {
        public Product()
        {
            ProductImages = new HashSet<ProductImage>();
        }
        [Key]
        public int ProductId { get; set; }
        [MaxLength(100)]
        public string? Code { get; set; }

        [MaxLength(250)]
        public string? Name { get; set; }
        public string? Description { get; set; }
        [ForeignKey("Categories")]
        public int? CatId { get; set; }
        public int? Price { get; set; }
        public double? Discount { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedDate { get; set; }
        public bool BestSellers { get; set; }
        //public bool HomeFlag { get; set; }
        public bool? IsActive { get; set; }
        [MaxLength(255)]
        public string? Tags { get; set; }
        [MaxLength(255)]
        public string? Title { get; set; }
        public int? Quantity { get; set; }

        public virtual Category? Cat { get; set; }
        public virtual ICollection<ProductImage> ProductImages { get; set; }
    }
}
