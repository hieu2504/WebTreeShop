using TreeShop.Api.Repository;

namespace TreeShop.Api.Service
{
    public interface IApplicationUserRoleService
    {
        Task<IQueryable<string>> GetAllUserRole(string userId);
    }

    public class ApplicationUserRoleService : IApplicationUserRoleService
    {
        private readonly IApplicationUserRoleRepository _applicationUserRoleRepository;

        public ApplicationUserRoleService(IApplicationUserRoleRepository applicationUserRoleRepository)
        {
            _applicationUserRoleRepository = applicationUserRoleRepository;
        }

        public async Task<IQueryable<string>> GetAllUserRole(string userId)
        {
            return await _applicationUserRoleRepository.GetListRole(userId);
        }
    }
}
