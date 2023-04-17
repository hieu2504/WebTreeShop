using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.Data
{
    public class AppUser : IdentityUser
    {
        public AppUser()
        {
        }
        public string? FullName { get; set; }
        public string? Address { get; set; }
        public string? Image { get; set; }
        public int Type { get; set; }

    }
}
