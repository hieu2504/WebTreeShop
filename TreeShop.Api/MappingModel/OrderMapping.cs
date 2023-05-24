using System.ComponentModel.DataAnnotations;
using TreeShop.Api.Data;

namespace TreeShop.Api.MappingModel
{
    public class OrderMapping
    {
        [Key]
        public int OrderId { get; set; }
        public string CustomerId { get; set; }
        public DateTime? OrderDate { get; set; }
        public int? TotalOrder { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string PayDescription { get; set; }
        public string TranDescription { get; set; }
        public int? TransactStatusId { get; set; }
        public int? PayId { get; set; }
        public List<OrderProductMapping> ProductMappings { get; set; }
        
    }
}
