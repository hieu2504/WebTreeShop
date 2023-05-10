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
        Task<IQueryable<Category>> GetAll(string keyword);
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
            if (await _categoryRepository.CheckContainsAsync(x => x.Code == category.Code))
            {
                throw new NameDuplicatedException("Mã loại sản phẩm đã tồn tại!");
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

        public async Task<Category> Update(Category category)
        {
            if (await _categoryRepository.CheckContainsAsync(x => x.Name == category.Name && x.CatId != category.CatId))
            {
                throw new NameDuplicatedException("Tên loại sản phẩm đã tồn tại!");
            }
            if (await _categoryRepository.CheckContainsAsync(x => x.Code == category.Code && x.CatId != category.CatId))
            {
                throw new NameDuplicatedException("Mã loại sản phẩm đã tồn tại!");
            }
            return await _categoryRepository.UpdateASync(category);
        }

        public async Task<IQueryable<Category>> GetAll(string keyword)
        {
            if (string.IsNullOrEmpty(keyword))
            {
                return await _categoryRepository.GetAllAsync();
            }
            else
            {
                return await _categoryRepository.GetAllAsync(x => x.Name.Contains(keyword) || x.Description.Contains(keyword));
            }
        }
    }
}
