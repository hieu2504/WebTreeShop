using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Extention;
using TreeShop.Api.MappingModel;
using TreeShop.Api.Repository;

namespace TreeShop.Api.Service
{
    public interface IOrderService
    {
        Task<IQueryable<Order>> GetAll();
        Task<Order> GetById(int id);
        Task<Order> Add(Order order);
        Task<Order> Update(Order order);
        Task<Order> Delete(int id);
        Task<IEnumerable<OrderMapping>> GetAllOrder(string fromDate, string toDate, int payId, int transId, string fullName, string phoneNumber);

        Task<List<OrderProductMapping>> GetProductOrderById(int orderId);
        Task<Order> GetOrderByIdNoTracking(int orderId);
        Task<IEnumerable<RevenueStatisticMapping>> GetRevenue(string fromDate, string toDate);
    }
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<Order> Add(Order order)
        {
            return await _orderRepository.AddASync(order);
        }

        public async Task<Order> Delete(int id)
        {
            return await _orderRepository.DeleteAsync(id);
        }

        public async Task<IQueryable<Order>> GetAll()
        {
            return await _orderRepository.GetAllAsync();
        }

        public async Task<Order> GetById(int id)
        {
            return await _orderRepository.GetByIdAsync(id);
        }

        public async Task<Order> Update(Order order)
        {
            return await _orderRepository.UpdateASync(order);
        }

        public async Task<IEnumerable<OrderMapping>> GetAllOrder(string fromDate, string toDate, int payId, int transId, string fullName, string phoneNumber)
        {
            string sql = "";
            if(payId != 0)
            {
                sql += " and pay.Id=" + payId;
            }
            if(transId != 0)
            {
                sql += " and trans.TransactStatusId=" + transId;
            }
            if (!string.IsNullOrEmpty(phoneNumber))
            {
                sql += " and od.PhoneNumber like '%" + phoneNumber + "%'";
            }
            sql += " ";
            if (!string.IsNullOrEmpty(fullName))
            {
                return (await _orderRepository.GetAllOrder(fromDate, toDate, sql)).Where(x => x.FullName.ToLower().Contains(fullName.ToLower()));
            }
            else
            {
                var res = await _orderRepository.GetAllOrder(fromDate, toDate, sql);
                return res;
            }

        }

        public async Task<List<OrderProductMapping>> GetProductOrderById(int orderId)
        {
            return await _orderRepository.GetProductOrderById(orderId);
        }

        public async Task<Order> GetOrderByIdNoTracking(int orderId)
        {
            return await _orderRepository.GetOrderByIdNoTracking(orderId);
        }

        public async Task<IEnumerable<RevenueStatisticMapping>> GetRevenue(string fromDate, string toDate)
        {
            return await _orderRepository.GetRevenue(fromDate, toDate);
        }
    }
}
