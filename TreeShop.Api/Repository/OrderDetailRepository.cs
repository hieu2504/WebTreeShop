using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure;

namespace TreeShop.Api.Repository
{
    public interface IOrderDetailRepository : IRepository<OrderDetail>
    {

    }
    public class OrderDetailRepository : RepositoryBase<OrderDetail>, IOrderDetailRepository
    {
        private readonly TreeShopDbContext _context;
        public OrderDetailRepository(TreeShopDbContext dbContext) : base(dbContext)
        {
            _context = dbContext;
        }
    }
}
