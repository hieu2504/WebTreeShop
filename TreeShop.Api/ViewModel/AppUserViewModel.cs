using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.ViewModel
{
    [NotMapped]
    public class AppUserViewModel : IdentityUser
    {
        public string? FullName { get; set; }
        public string? Address { get; set; }
        public string? Image { get; set; }
        public int Type { get; set; }
        public List<string> LstRoleId { get; set; }
    }
}
