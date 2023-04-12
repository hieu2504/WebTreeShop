using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.Data
{
    [Table("ProductImages")]
    public partial class ProductImage
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Products")]
        public int? ProductId { get; set; }
        public string? ImageLink { get; set; }

        public virtual Product? Product { get; set; }
    }
}
