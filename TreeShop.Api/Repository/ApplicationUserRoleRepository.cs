using Microsoft.EntityFrameworkCore;
using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure;

namespace TreeShop.Api.Repository
{
    public interface IApplicationUserRoleRepository : IRepository<AppUserRole>
    {
        Task<IQueryable<string>> GetListRole(string userId);
    }
    public class ApplicationUserRoleRepository : RepositoryBase<AppUserRole>, IApplicationUserRoleRepository
    {
        private TreeShopDbContext DbContext;

        public ApplicationUserRoleRepository(TreeShopDbContext dbContext) : base(dbContext)
        {
            DbContext = dbContext;
        }

        public async Task<IQueryable<string>> GetListRole(string userId)
        {
            return (await (from r in DbContext.UserRoles
                           join role in DbContext.Roles on r.RoleId equals role.Id
                           where r.UserId == userId
                           select role.Name).ToListAsync()).AsQueryable();
        }
    }
}
