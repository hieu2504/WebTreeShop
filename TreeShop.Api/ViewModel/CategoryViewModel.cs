namespace TreeShop.Api.ViewModel
{
    public class CategoryViewModel
    {
        public int CatId { get; set; }
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? Ordering { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? Icon { get; set; }
    }
}
