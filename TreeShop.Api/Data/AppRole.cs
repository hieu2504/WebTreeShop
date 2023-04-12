using Microsoft.AspNetCore.Identity;

namespace TreeShop.Api.Data
{
    public class AppRole:IdentityRole
    {
        public AppRole()
        {
        }
        public string? Description { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
