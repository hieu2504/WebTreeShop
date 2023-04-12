using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure;

namespace TreeShop.Api.Repository
{
    public interface ICategoryRepository : IRepository<Category>
    {

    }
    public class CategoryRepository : RepositoryBase<Category>, ICategoryRepository
    {
        private readonly TreeShopDbContext _context;
        public CategoryRepository(TreeShopDbContext dbContext) : base(dbContext)
        {
            _context = dbContext;
        }
    }
}
