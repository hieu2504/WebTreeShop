﻿using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Extention;
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
    }
}