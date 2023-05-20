using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Extention;
using TreeShop.Api.Repository;

namespace TreeShop.Api.Service
{
    public interface IOrderDetailService
    {
        Task<IQueryable<OrderDetail>> GetAll();
        Task<OrderDetail> GetById(int id);
        Task<OrderDetail> Add(OrderDetail orderDetail);
        Task<OrderDetail> Update(OrderDetail orderDetail);
        Task<OrderDetail> Delete(int id);
    }
    public class OrderDetailService : IOrderDetailService
    {
        private readonly IOrderDetailRepository _orderDetailRepository;
        public OrderDetailService(IOrderDetailRepository orderDetailRepository)
        {
            _orderDetailRepository = orderDetailRepository;
        }

        public async Task<OrderDetail> Add(OrderDetail orderDetail)
        {
            return await _orderDetailRepository.AddASync(orderDetail);
        }

        public async Task<OrderDetail> Delete(int id)
        {
            return await _orderDetailRepository.DeleteAsync(id);
        }

        public async Task<IQueryable<OrderDetail>> GetAll()
        {
            return await _orderDetailRepository.GetAllAsync();
        }

        public async Task<OrderDetail> GetById(int id)
        {
            return await _orderDetailRepository.GetByIdAsync(id);
        }

        public async Task<OrderDetail> Update(OrderDetail orderDetail)
        {
            return await _orderDetailRepository.UpdateASync(orderDetail);
        }
    }
}
