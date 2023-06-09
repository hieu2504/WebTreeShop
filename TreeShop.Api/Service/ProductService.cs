﻿using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Extention;
using TreeShop.Api.MappingModel;
using TreeShop.Api.Repository;
using TreeShop.Api.ViewModel;

namespace TreeShop.Api.Service
{
    public interface IProductService
    {
        Task<IQueryable<Product>> GetAll();
        Task<Product> GetById(int id);
        Task<Product> Add(Product product);
        Task<Product> Update(Product product);
        Task<Product> Delete(int id);
        Task<IQueryable<Product>> GetAll(string keyword);
        Task<IQueryable<ProductMappingModel>> GetAllMapping(string keyword);
        Task<ProductMappingModel> GetByIdMapping(int id);
        Task<IQueryable<ProductMappingModel>> GetProductShop(string keyword);
        Task<List<OrderShopViewModel>> GetListOrderShop(List<OrderRequestModel> lst);
        Task<bool> CheckQuantity(int quantity, int productId);
        Task<Product> GetByIdNoTrasking(int id);
    }
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<Product> Add(Product Product)
        {
            if (await _productRepository.CheckContainsAsync(x => x.Name == Product.Name))
            {
                throw new NameDuplicatedException("Tên sản phẩm đã tồn tại!");
            }
            if (await _productRepository.CheckContainsAsync(x => x.Code == Product.Code))
            {
                throw new NameDuplicatedException("Mã sản phẩm đã tồn tại!");
            }
            return await _productRepository.AddASync(Product);
        }

        public async Task<Product> Delete(int id)
        {
            return await _productRepository.DeleteAsync(id);
        }

        public async Task<IQueryable<Product>> GetAll()
        {
            return await _productRepository.GetAllAsync(x => x.IsActive == true);
        }

        public async Task<Product> GetById(int id)
        {
            return await _productRepository.GetByIdAsync(id);
        }

        public async Task<Product> Update(Product Product)
        {
            if (await _productRepository.CheckContainsAsync(x => x.Name == Product.Name && x.CatId != Product.CatId))
            {
                throw new NameDuplicatedException("Tên sản phẩm đã tồn tại!");
            }
            if (await _productRepository.CheckContainsAsync(x => x.Code == Product.Code && x.CatId != Product.CatId))
            {
                throw new NameDuplicatedException("Mã sản phẩm đã tồn tại!");
            }
            return await _productRepository.UpdateASync(Product);
        }

        public async Task<IQueryable<Product>> GetAll(string keyword)
        {
            if (string.IsNullOrEmpty(keyword))
            {
                return await _productRepository.GetAllAsync();
            }
            else
            {
                return await _productRepository.GetAllAsync(x => x.Name.Contains(keyword) || x.Description.Contains(keyword));
            }
        }

        public async Task<IQueryable<ProductMappingModel>> GetAllMapping(string keyword)
        {
            return await _productRepository.GetAllMapping(keyword);
        }

        public async Task<ProductMappingModel> GetByIdMapping(int id)
        {
            return await _productRepository.GetByIdMapping(id);
        }

        public async Task<IQueryable<ProductMappingModel>> GetProductShop(string keyword)
        {
            return await _productRepository.GetProductShop(keyword);
        }

        // Get Danh sach san pham vao gio hang
        public async Task<List<OrderShopViewModel>> GetListOrderShop(List<OrderRequestModel> lst)
        {
            return await _productRepository.GetListOrderShop(lst);
        }

        public async Task<bool> CheckQuantity(int quantity, int productId)
        {
            Product product = await _productRepository.GetByIdAsync(productId);
            if(product.Quantity < quantity)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public async Task<Product> GetByIdNoTrasking(int id)
        {
            return await _productRepository.GetByIdNoTrasking(id);
        }
    }
}
