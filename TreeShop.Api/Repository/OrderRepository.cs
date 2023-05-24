using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure;
using TreeShop.Api.MappingModel;

namespace TreeShop.Api.Repository
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<IEnumerable<OrderMapping>> GetAllOrder(string fromDate, string toDate, string sql);
    }
    public class OrderRepository : RepositoryBase<Order>, IOrderRepository
    {
        private readonly TreeShopDbContext _context;
        public OrderRepository(TreeShopDbContext dbContext) : base(dbContext)
        {
            _context = dbContext;
        }

        public async Task<IEnumerable<OrderMapping>> GetAllOrder(string fromDate, string toDate, string sql)
        {
            var parameters = new SqlParameter[]
              {
                  new SqlParameter("@strSql",SqlDbType.NVarChar){Value = sql},
                    new SqlParameter("@strTuNgay",SqlDbType.NVarChar){Value = fromDate},
                    new SqlParameter("@strDenNgay",SqlDbType.NVarChar){Value = toDate},
              };
            return await _context.OrderMappings.FromSqlRaw("[dbo].[OrderManager] @strSql,@strTuNgay,@strDenNgay", parameters).ToListAsync();
        }
    }
}
