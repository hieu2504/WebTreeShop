using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure;
using TreeShop.Api.MappingModel;
using TreeShop.Api.ViewModel;

namespace TreeShop.Api.Repository
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<IEnumerable<OrderMapping>> GetAllOrder(string fromDate, string toDate, string sql);
        Task<List<OrderProductMapping>> GetProductOrderById(int orderId);
        Task<Order> GetOrderByIdNoTracking(int orderId);
        Task<IEnumerable<RevenueStatisticMapping>> GetRevenue(string fromDate, string toDate);
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

        public async Task<List<OrderProductMapping>> GetProductOrderById(int orderId)
        {
            var query = await (from od in _context.Orders
                               join odt in _context.OrderDetails on od.OrderId equals odt.OrderId
                               join p in _context.Products on odt.ProductId equals p.ProductId

                               where od.OrderId == orderId
                               select new OrderProductMapping
                               {
                                   ProductId = p.ProductId,
                                   Title = p.Title,
                                   Code = p.Code,
                                   Price = p.Price,
                                   Discount = odt.Discount,
                                   Quantity = odt.Quantity,
                                   Total = odt.Total
                               }).ToListAsync();
            return query;

        }

        public async Task<Order> GetOrderByIdNoTracking(int orderId)
        {
            var query = await(from od in _context.Orders where od.OrderId == orderId select od).FirstOrDefaultAsync();
            return query;
        }

        public async Task<IEnumerable<RevenueStatisticMapping>> GetRevenue(string fromDate, string toDate)
        {
            var parameters = new SqlParameter[]
              {
                    new SqlParameter("@strTuNgay",SqlDbType.NVarChar){Value = fromDate},
                    new SqlParameter("@strDenNgay",SqlDbType.NVarChar){Value = toDate},
              };
            return await _context.RevenueStatisticMappings.FromSqlRaw("[dbo].[Revenue] @strTuNgay,@strDenNgay", parameters).ToListAsync();
        }
    }
}
