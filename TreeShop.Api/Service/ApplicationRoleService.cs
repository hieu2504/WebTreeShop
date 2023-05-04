using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Extention;
using TreeShop.Api.Repository;

namespace TreeShop.Api.Service
{
    public interface IApplicationRoleService
    {
        Task<AppRole> GetDetail(string id);

        Task<IQueryable<AppRole>> GetAll(string keyword);

        Task<IQueryable<AppRole>> GetAll();

        Task<AppRole> Add(AppRole appRole);

        Task<AppRole> Update(AppRole appRole);

        Task<AppRole> Delete(string id);
    }
    public class ApplicationRoleService : IApplicationRoleService
    {
        private readonly IApplicationRoleRepository _applicationRoleRepository;

        public ApplicationRoleService(IApplicationRoleRepository applicationRoleRepository)
        {
            _applicationRoleRepository = applicationRoleRepository;
        }

        public async Task<AppRole> Add(AppRole appRole)
        {
            if (await _applicationRoleRepository.CheckContainsAsync(r => r.Description == appRole.Description || r.Name == appRole.Name))
                throw new NameDuplicatedException("Tên và mô tả không được trùng.");
            return await _applicationRoleRepository.AddASync(appRole);
        }

        public async Task<AppRole> Delete(string id)
        {
            return await _applicationRoleRepository.DeleteAsync(id);
        }

        public async Task<IQueryable<AppRole>> GetAll(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
                return await _applicationRoleRepository.GetAllAsync(x => x.Name.ToUpper().Contains(keyword.ToUpper()) || x.Description.Contains(keyword.ToUpper()));
            else
                return await _applicationRoleRepository.GetAllAsync();
        }

        public async Task<IQueryable<AppRole>> GetAll()
        {
            return await _applicationRoleRepository.GetAllAsync();
        }

        public async Task<AppRole> GetDetail(string id)
        {
            return await _applicationRoleRepository.GetSingleByConditionAsync(s => s.Id == id);
        }

        public async Task<AppRole> Update(AppRole appRole)
        {
            if (await _applicationRoleRepository.CheckContainsAsync(x => (x.Description == appRole.Description || x.Name == appRole.Name) && x.Id != appRole.Id))
                throw new NameDuplicatedException("Tên và mô tả không được trùng.");
            return await _applicationRoleRepository.UpdateASync(appRole);
        }
    }
}
