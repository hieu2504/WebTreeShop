using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Extention;
using TreeShop.Api.Repository;

namespace TreeShop.Api.Service
{
    public interface ICategoryService
    {
        Task<IQueryable<Category>> GetAll();
        Task<Category> GetById(int id);
        Task<Category> Add(Category category);
        Task<Category> Update(Category category);
        Task<Category> Delete(int id);
    }
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<Category> Add(Category category)
        {
            if (await _categoryRepository.CheckContainsAsync(x => x.Name == category.Name))
            {
                throw new NameDuplicatedException("Tên loại sản phẩm đã tồn tại!");
            }
            return await _categoryRepository.AddASync(category);
        }

        public async Task<Category> Delete(int id)
        {
            return await _categoryRepository.DeleteAsync(id);
        }

        public async Task<IQueryable<Category>> GetAll()
        {
            return await _categoryRepository.GetAllAsync(x => x.IsActive == true);
        }

        public async Task<Category> GetById(int id)
        {
            return await _categoryRepository.GetByIdAsync(id);
        }

        public async Task<Category> Update(Category kiosk)
        {
            
            return await _categoryRepository.UpdateASync(kiosk);
        }
    }
}
