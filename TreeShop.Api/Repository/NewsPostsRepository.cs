using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure;

namespace TreeShop.Api.Repository
{
    public interface INewsPostRepository : IRepository<NewsPost>
    {

    }
    public class NewsPostRepository : RepositoryBase<NewsPost>, INewsPostRepository
    {
        private readonly TreeShopDbContext _context;
        public NewsPostRepository(TreeShopDbContext dbContext) : base(dbContext)
        {
            _context = dbContext;
        }
    }
}
