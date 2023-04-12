using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.Data
{
    [Table("Customers")]
    public partial class Customer
    {
        public Customer()
        {
            Orders = new HashSet<Order>();
        }
        [Key]
        public int CustomerId { get; set; }
        [MaxLength(100)]
        public string? Username { get; set; }
        [MaxLength(500)]
        public string? Password { get; set; }
        [MaxLength(250)]
        public string? Name { get; set; }
        [MaxLength(500)]
        public string? Address { get; set; }
        [MaxLength(10)]
        [Column(TypeName = "varchar")]
        public string? Phone { get; set; }
        [MaxLength(150)]
        public string? Email { get; set; }
        public string? Image { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
