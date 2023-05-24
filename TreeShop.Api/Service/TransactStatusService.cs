using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Extention;
using TreeShop.Api.Repository;

namespace TreeShop.Api.Service
{
    public interface ITransactStatusService
    {
        Task<IQueryable<TransactStatus>> GetAll();
    }
    public class TransactStatusService : ITransactStatusService
    {
        private readonly ITransactStatusRepository _transactStatusRepository;
        public TransactStatusService(ITransactStatusRepository transactStatusRepository)
        {
            _transactStatusRepository = transactStatusRepository;
        }

        public async Task<IQueryable<TransactStatus>> GetAll()
        {
            return await _transactStatusRepository.GetAllAsync(x=>x.Status==true);
        }
    }
}
