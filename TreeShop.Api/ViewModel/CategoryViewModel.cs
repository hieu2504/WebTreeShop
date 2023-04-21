namespace TreeShop.Api.ViewModel
{
    public class CategoryViewModel
    {
        public int? CatId { get; set; }
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? Ordering { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? Icon { get; set; }
        public IFormFile? Files { get; set; }
    }

    public class FileUploadAPI1
    {
        public string? Code { get; set; }

    }

    public class FileUploadAPI
    {
        public int ImgID { get; set; }
        //public IFormFile? files { get; set; }
        public List<IFormFile>? lstFiles { get; set; }

    }
}
