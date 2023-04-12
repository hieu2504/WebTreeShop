using TreeShop.Api.Data;
using TreeShop.Api.Repository;

namespace TreeShop.Api.Service
{
    public interface IApplicationUserService
    {
        Task<IQueryable<AppUser>> GetAll();
        Task<IQueryable<AppUser>> GetAll(string keyword);
    }

    public class ApplicationUserService : IApplicationUserService
    {
        private readonly IApplicationUserRepository _applicationUserRepository;
        private TreeShopDbContext _dbContext;

        public ApplicationUserService(IApplicationUserRepository applicationUserRepository, TreeShopDbContext dbContext)
        {
            _applicationUserRepository = applicationUserRepository;
            _dbContext = dbContext;
        }

        public async Task<IQueryable<AppUser>> GetAll()
        {
            return await _applicationUserRepository.GetAllAsync();
        }

        public async Task<IQueryable<AppUser>> GetAll(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
            {
                return await _applicationUserRepository.GetAllAsync(x => x.UserName.ToUpper().Contains(keyword));
            }
            else
                return await _applicationUserRepository.GetAllAsync();
        }

       
    }
}
