using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Extention;
using TreeShop.Api.Repository;

namespace TreeShop.Api.Service
{
    public interface IPaymentService
    {
        Task<IQueryable<Payment>> GetAll();
    }
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        public PaymentService(IPaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }

        public async Task<IQueryable<Payment>> GetAll()
        {
            return await _paymentRepository.GetAllAsync(x=>x.Status==true);
        }
    }
}
