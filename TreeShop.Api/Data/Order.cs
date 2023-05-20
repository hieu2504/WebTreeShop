using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.Data
{
    [Table("Orders")]
    public partial class Order
    {
        public Order()
        {
            OrderDetails = new HashSet<OrderDetail>();
        }
        [Key]
        public int OrderId { get; set; }
        [ForeignKey("AppUsers")]
        public int? CustomerId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? OrderDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ShipDate { get; set; }
        [ForeignKey("TransactStatus")]
        public int? TransactStatusId { get; set; }
        public bool? Paid { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? PaymentDate { get; set; }
        [ForeignKey("Payments")]
        public int? PaymentId { get; set; }
        [MaxLength(500)]
        public string? ShippingAddress { get; set; }
        public string? Note { get; set; }
        public virtual TransactStatus? TransactStatus { get; set; }
        public virtual Payment? Payments { get; set; }
        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
