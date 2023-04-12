using Microsoft.AspNetCore.Identity;

namespace TreeShop.Api.ViewModel
{
    public class AppRoleViewModel : IdentityRole
    {
        public string? Description { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
