using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.ViewModel
{
    public partial class PaymentViewModel
    {
        public int Id { get; set; }
        public bool? Status { get; set; }
        public string? Description { get; set; }
    }
}
