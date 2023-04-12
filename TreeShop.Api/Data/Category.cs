using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.Data
{
    [Table("Categories")]
    public partial class Category
    {
        public Category()
        {
            Products = new HashSet<Product>();
        }
        [Key]
        public int CatId { get; set; }
        [MaxLength(100)]
        public string? Code { get; set; }
        [MaxLength(250)]
        public string? Name { get; set; }
        [MaxLength(500)]
        public string? Description { get; set; }
        public int? Ordering { get; set; }
        public bool? IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedDate { get; set; }
        public string? Icon { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }
}
