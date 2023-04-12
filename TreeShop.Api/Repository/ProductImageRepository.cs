using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure;

namespace TreeShop.Api.Repository
{
    public interface IProductImageRepository : IRepository<ProductImage>
    {

    }
    public class ProductImageRepository : RepositoryBase<ProductImage>, IProductImageRepository
    {
        private readonly TreeShopDbContext _context;
        public ProductImageRepository(TreeShopDbContext dbContext) : base(dbContext)
        {
            _context = dbContext;
        }
    }
}
