using TreeShop.Api.Data;
using TreeShop.Api.ViewModel;

namespace TreeShop.Api.Infrastructure.Extention
{
    public static class EntityExtentions
    {
        public static void UpdateUser(this AppUser appUser, AppUserViewModel appUserViewModel, string action = "add")
        {
            if (action == "add") { 
                appUser.Id = Guid.NewGuid().ToString();
                appUser.CreatedDate = DateTime.Now; 
                appUser.UpdatedDate = appUser.CreatedDate; 
            }
            else
            {
                appUser.Id = appUserViewModel.Id;
                appUser.UpdatedDate = DateTime.Now;
            }
            appUser.Email = appUserViewModel.Email;
            appUser.UserName = appUserViewModel.UserName;
            appUser.PhoneNumber = appUserViewModel.PhoneNumber;
            appUser.NormalizedUserName = appUserViewModel.UserName;
            appUser.FullName = appUserViewModel.FullName;
            appUser.Type = appUserViewModel.Type;
            appUser.Image = appUserViewModel.Image;
            appUser.Address = appUserViewModel.Address;
            
        }


        public static void UpdateApplicationRole(this AppRole appRole, AppRoleViewModel appRoleViewModel, string action = "add")
        {
            if (action == "update")
                appRole.Id = appRoleViewModel.Id;
            else
                appRole.Id = Guid.NewGuid().ToString();
            appRole.Name = appRoleViewModel.Name;
            appRole.Description = appRoleViewModel.Description;
            appRole.NormalizedName = appRoleViewModel.Name;
        }
    }
}
