using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TreeShop.Api.ViewModel
{
    public class NewsPostViewModel
    {
        public int PostId { get; set; }
        public string? Name { get; set; }
        public string? Contents { get; set; }
        public string? Thumb { get; set; }
        public bool? Published { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public IFormFile? Files { get; set; }
    }
}
