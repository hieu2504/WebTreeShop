using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure;

namespace TreeShop.Api.Repository
{
    public interface IApplicationRoleRepository : IRepository<AppRole>
    {
    }
    public class ApplicationRoleRepository : RepositoryBase<AppRole>, IApplicationRoleRepository
    {
        private readonly TreeShopDbContext _dbContext;
        public ApplicationRoleRepository(TreeShopDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }
    }
}
