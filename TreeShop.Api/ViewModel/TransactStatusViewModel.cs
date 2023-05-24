using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using TreeShop.Api.Data;

namespace TreeShop.Api.ViewModel
{
    public class TransactStatusViewModel
    {
        public int TransactStatusId { get; set; }
        public bool? Status { get; set; }
        public string? Description { get; set; }
    }
}
