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
        Task<List<OrderProductMapping>> GetOrderById(int orderId);
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

        public async Task<List<OrderProductMapping>> GetOrderById(int orderId)
        {
            //var query = from p in _context.Products
            //                  join pc in _context.Categories on p.CatId equals pc.CatId
            //                  where p.IsActive == true && p.ProductId == item.Id
            //                  select new OrderShopViewModel
            //                  {
            //                      ProductId = p.ProductId,
            //                      Code = p.Code,
            //                      Name = p.Name,
            //                      Price = p.Price,
            //                      Discount = p.Discount,
            //                      Title = p.Title,
            //                      Quantity = p.Quantity,
            //                      OrderQuantity = item.OrderQuantity,
            //                      ProductImages = (from prImg in _context.ProductImages
            //                                       where prImg.ProductId == p.ProductId
            //                                       select prImg).ToList(),
            //                  }).ToListAsync();
            //result.AddRange(query);

            var query = await (from od in _context.Orders
                               join odt in _context.OrderDetails on od.OrderId equals odt.OrderId
                               join p in _context.Products on odt.ProductId equals p.ProductId

                               where od.OrderId == orderId
                               select new OrderProductMapping
                               {
                                   ProductId = p.ProductId,
                                   ProductName = p.Name,
                                   Code = p.Code,
                                   Price = p.Price,
                                   Discount = odt.Discount,
                                   Quantity = odt.Quantity,
                                   Total = odt.Total
                               }).ToListAsync();
            return query;

        }
    }
}
