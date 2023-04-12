using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.Data
{
    [Table("Payments")]
    public partial class Payment
    {
        public Payment()
        {
            Orders = new HashSet<Order>();
        }
        [Key]
        public int Id { get; set; }
        public bool? Status { get; set; }
        [MaxLength(250)]
        public string? Description { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
