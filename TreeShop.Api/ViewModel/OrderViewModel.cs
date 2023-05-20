using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using TreeShop.Api.Data;

namespace TreeShop.Api.ViewModel
{
    public class OrderViewModel
    {
        public int OrderId { get; set; }
        public int? CustomerId { get; set; }
        public DateTime? OrderDate { get; set; }
        public DateTime? ShipDate { get; set; }
        public int? TransactStatusId { get; set; }
        public bool? Paid { get; set; }
        public DateTime? PaymentDate { get; set; }
        public int? PaymentId { get; set; }
        public string? ShippingAddress { get; set; }
        public string? Note { get; set; }
        public List<OrderDetail> lstOrderDetails { get; set; }
    }
}
