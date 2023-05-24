using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure;

namespace TreeShop.Api.Repository
{
    public interface ITransactStatusRepository : IRepository<TransactStatus>
    {

    }
    public class TransactStatusRepository : RepositoryBase<TransactStatus>, ITransactStatusRepository
    {
        private readonly TreeShopDbContext _context;
        public TransactStatusRepository(TreeShopDbContext dbContext) : base(dbContext)
        {
            _context = dbContext;
        }
    }
}
