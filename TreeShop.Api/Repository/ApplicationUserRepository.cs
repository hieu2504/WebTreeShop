using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure;

namespace TreeShop.Api.Repository
{
    public interface IApplicationUserRepository : IRepository<AppUser>
    {
    }

    public class ApplicationUserRepository : RepositoryBase<AppUser>, IApplicationUserRepository
    {
        private TreeShopDbContext _dbContext;

        public ApplicationUserRepository(TreeShopDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

       
    }
}
