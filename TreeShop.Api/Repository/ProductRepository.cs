using Microsoft.EntityFrameworkCore;
using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure;
using TreeShop.Api.MappingModel;
using TreeShop.Api.ViewModel;

namespace TreeShop.Api.Repository
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<IQueryable<ProductMappingModel>> GetAllMapping(string keyword);
        Task<IQueryable<ProductMappingModel>> GetProductShop(string keyword);
        Task<ProductMappingModel> GetByIdMapping(int id);
        Task<List<OrderShopViewModel>> GetListOrderShop(List<OrderRequestModel> lst);
        Task<Product> GetByIdNoTrasking(int id);
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

        public async Task<ProductMappingModel> GetByIdMapping(int id)
        {
            var query = await (from p in _context.Products
                               join cat in _context.Categories on p.CatId equals cat.CatId
                         where p.ProductId == id
                         select new ProductMappingModel
                         {
                             ProductId = p.ProductId,
                             Code = p.Code,
                             Name = p.Name,
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
                             Quantity = p.Quantity,
                             CategoryName = cat.Name,
                             ProductImages = (from prImg in _context.ProductImages
                                              where prImg.ProductId == id
                                              select prImg).ToList(),

                         }).FirstOrDefaultAsync();
            return query;
        }

        public async Task<IQueryable<ProductMappingModel>> GetProductShop(string keyword)
        {
            if (string.IsNullOrEmpty(keyword))
            {
                var query = (from p in _context.Products
                             join pc in _context.Categories on p.CatId equals pc.CatId
                             where p.IsActive == true
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
                                 Quantity = p.Quantity,
                                 ProductImages = (from prImg in _context.ProductImages
                                                  where prImg.ProductId == p.ProductId
                                                  select prImg).ToList(),
                             }).ToListAsync();
                return (await query).AsQueryable();
            }
            else
            {
                var query = (from p in _context.Products
                             join pc in _context.Categories on p.CatId equals pc.CatId
                             where p.IsActive == true && (p.Title.ToLower().Contains(keyword.ToLower()) || pc.Name.ToLower().Contains(keyword.ToLower()))
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
                                 Quantity = p.Quantity,
                                 ProductImages = (from prImg in _context.ProductImages
                                                  where prImg.ProductId == p.ProductId
                                                  select prImg).ToList(),
                             }).ToListAsync();
                return (await query).AsQueryable();
            }
        }

        public async Task<List<OrderShopViewModel>> GetListOrderShop(List<OrderRequestModel> lst)
        {
            List<OrderShopViewModel> result = new List<OrderShopViewModel>();
            foreach(var item in lst)
            {
                var query = await (from p in _context.Products
                             join pc in _context.Categories on p.CatId equals pc.CatId
                             where p.IsActive == true && p.ProductId == item.Id
                             select new OrderShopViewModel
                             {
                                 ProductId = p.ProductId,
                                 Code = p.Code,
                                 Name = p.Name,
                                 Price = p.Price,
                                 Discount = p.Discount,
                                 Title = p.Title,
                                 Quantity = p.Quantity,
                                 OrderQuantity = p.Quantity < item.OrderQuantity ? (int)p.Quantity : item.OrderQuantity,
                                 ProductImages = (from prImg in _context.ProductImages
                                                  where prImg.ProductId == p.ProductId
                                                  select prImg).ToList(),
                             }).ToListAsync();
                result.AddRange(query);
            }
            
            return result;
        }

        public async Task<Product> GetByIdNoTrasking(int id)
        {
            var query = await (from p in _context.Products where p.ProductId == id select p).FirstOrDefaultAsync();
            return query;
        }
    }
}
