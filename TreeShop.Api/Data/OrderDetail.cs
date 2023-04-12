using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.Data
{
    [Table("OrderDetails")]
    public partial class OrderDetail
    {
        [Key]
        public int OrderDetailId { get; set; }
        [ForeignKey("Orders")]
        public int? OrderId { get; set; }
        public int? ProductId { get; set; }
        public int? Quantity { get; set; }
        public int? Discount { get; set; }
        public int? Total { get; set; }

        public virtual Order? Order { get; set; }
    }
}
