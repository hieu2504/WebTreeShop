using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.Data
{
    [Table("TransactStatus")]
    public partial class TransactStatus
    {
        public TransactStatus()
        {
            Orders = new HashSet<Order>();
        }
        [Key]
        public int TransactStatusId { get; set; }
        public bool? Status { get; set; }
        [MaxLength(250)]
        public string? Description { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
