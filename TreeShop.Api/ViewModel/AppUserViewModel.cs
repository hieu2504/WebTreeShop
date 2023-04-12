using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.ViewModel
{
    [NotMapped]
    public class AppUserViewModel : IdentityUser
    {
        public string? FullName { get; set; }
        public List<string> LstRoleId { get; set; }
    }
}
