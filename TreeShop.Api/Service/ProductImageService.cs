using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Extention;
using TreeShop.Api.Repository;

namespace TreeShop.Api.Service
{
    public interface IProductImageService
    {
        Task<IQueryable<ProductImage>> GetAllByProId(int proId);
        Task<ProductImage> GetById(int id);
        Task<ProductImage> Add(ProductImage productImage);
        Task<ProductImage> Update(ProductImage productImage);
        Task<ProductImage> Delete(int id);
    }
    public class ProductImageService : IProductImageService
    {
        private readonly IProductImageRepository _productImageRepository;
        public ProductImageService(IProductImageRepository productImageRepository)
        {
            _productImageRepository = productImageRepository;
        }

        public async Task<ProductImage> Add(ProductImage productImage)
        {
            return await _productImageRepository.AddASync(productImage);
        }

        public async Task<ProductImage> Delete(int id)
        {
            return await _productImageRepository.DeleteAsync(id);
        }

        public async Task<IQueryable<ProductImage>> GetAllByProId(int proId)
        {
            return await _productImageRepository.GetAllAsync(x => x.ProductId == proId);
        }

        public async Task<ProductImage> GetById(int id)
        {
            return await _productImageRepository.GetByIdAsync(id);
        }

        public async Task<ProductImage> Update(ProductImage ProductImage)
        {
            return await _productImageRepository.UpdateASync(ProductImage);
        }
    }
}
