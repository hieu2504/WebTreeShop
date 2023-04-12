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
    }
}
