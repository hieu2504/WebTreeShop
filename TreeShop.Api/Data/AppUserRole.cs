using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace TreeShop.Api.Data
{
    // <summary>
    /// Quyền được cấp cho tài khoản
    /// </summary>
    [Table("AppUserRoles")]
    public class AppUserRole : IdentityUserRole<string>
    {

    }
}
