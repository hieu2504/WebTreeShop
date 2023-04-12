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
        [MaxLength(250)]
        public string? ProductName { get; set; }
        public string? Description { get; set; }
        [ForeignKey("Categories")]
        public int? CatId { get; set; }
        public int? Price { get; set; }
        public int? Discount { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DateCreated { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DateModified { get; set; }
        public bool BestSellers { get; set; }
        public bool HomeFlag { get; set; }
        public bool? Active { get; set; }
        [MaxLength(255)]
        public string? Tags { get; set; }
        [MaxLength(255)]
        public string? Title { get; set; }
        public int? Quantity { get; set; }

        public virtual Category? Cat { get; set; }
        public virtual ICollection<ProductImage> ProductImages { get; set; }
    }
}
