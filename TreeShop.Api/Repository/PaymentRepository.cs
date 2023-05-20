using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure;

namespace TreeShop.Api.Repository
{
    public interface IPaymentRepository : IRepository<Payment>
    {

    }
    public class PaymentRepository : RepositoryBase<Payment>, IPaymentRepository
    {
        private readonly TreeShopDbContext _context;
        public PaymentRepository(TreeShopDbContext dbContext) : base(dbContext)
        {
            _context = dbContext;
        }
    }
}
