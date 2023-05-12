using Microsoft.EntityFrameworkCore;
using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure;
using TreeShop.Api.MappingModel;

namespace TreeShop.Api.Repository
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<IQueryable<ProductMappingModel>> GetAllMapping(string keyword);
    }
    public class ProductRepository : RepositoryBase<Product>, IProductRepository
    {
        private readonly TreeShopDbContext _context;
        public ProductRepository(TreeShopDbContext dbContext) : base(dbContext)
        {
            _context = dbContext;
        }

        public async Task<IQueryable<ProductMappingModel>> GetAllMapping(string keyword)
        {
            if (string.IsNullOrEmpty(keyword))
            {
                var query = (from p in _context.Products
                             join pc in _context.Categories on p.CatId equals pc.CatId
                             select new ProductMappingModel
                             {
                                 ProductId = p.ProductId,
                                 Code = p.Code,
                                 Name = p.Name,
                                 CategoryName = pc.Name,
                                 Description = p.Description,
                                 CatId = p.CatId,
                                 Price = p.Price,
                                 Discount = p.Discount,
                                 CreatedDate = p.CreatedDate,
                                 UpdatedDate = p.UpdatedDate,
                                 BestSellers = p.BestSellers,
                                 IsActive = p.IsActive,
                                 Tags = p.Tags,
                                 Title = p.Title,
                                 Quantity = p.Quantity
                             }).ToListAsync();
                return (await query).AsQueryable();
            }
            else
            {
                var query = (from p in _context.Products
                             join pc in _context.Categories on p.CatId equals pc.CatId
                             where p.Name.ToLower().Contains(keyword.ToLower()) || pc.Name.ToLower().Contains(keyword.ToLower())
                             select new ProductMappingModel
                             {
                                 ProductId = p.ProductId,
                                 Code = p.Code,
                                 Name = p.Name,
                                 CategoryName = pc.Name,
                                 Description = p.Description,
                                 CatId = p.CatId,
                                 Price = p.Price,
                                 Discount = p.Discount,
                                 CreatedDate = p.CreatedDate,
                                 UpdatedDate = p.UpdatedDate,
                                 BestSellers = p.BestSellers,
                                 IsActive = p.IsActive,
                                 Tags = p.Tags,
                                 Title = p.Title,
                                 Quantity = p.Quantity
                             }).ToListAsync();
                return (await query).AsQueryable();
            }
        }
    }
}
