using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.Data
{
    [Table("NewsPosts")]
    public partial class NewsPost
    {
        [Key]
        public int PostId { get; set; }
        [MaxLength(250)]
        public string? Name { get; set; }
        public string? Contents { get; set; }
        public string? Thumb { get; set; }
        public bool? Published { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }
    }
}
