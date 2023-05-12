using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Core;
using TreeShop.Api.MappingModel;
using TreeShop.Api.Service;
using TreeShop.Api.ViewModel;

namespace TreeShop.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        #region Initial
        private readonly IProductService _productService;
        private readonly IProductImageService _productImageService;
        private readonly IMapper _mapper;
        public static IWebHostEnvironment _environment;

        public ProductController(IProductService productService, IProductImageService productImageService, IMapper mapper, IWebHostEnvironment environment)
        {
            _productService = productService;
            _productImageService = productImageService;
            _mapper = mapper;
            _environment = environment;
        }
        #endregion
        #region Properties
        /// <summary>
        /// Them moi loai san pham
        /// </summary>
        /// <param name="categoryViewModel"></param>
        /// <returns></returns>
        [HttpPost("Create"), DisableRequestSizeLimit]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromForm] ProductViewModel productViewModel)
        {
            if (ModelState.IsValid)
            {

                var model = _mapper.Map<ProductViewModel, Product>(productViewModel);
                try
                {
                    model.CreatedDate = DateTime.Now;
                    model.UpdatedDate = model.CreatedDate;

                    var product = await _productService.Add(model);
                    
                    if (productViewModel.lstFiles != null)
                    {
                        foreach (var item in productViewModel.lstFiles)
                        {
                            var imgName = "\\Images\\" + DateTime.Now.ToString("yyyyMMddHHmmss") + item.FileName;
                            if (item.Length > 0)
                            {
                                if (!Directory.Exists(_environment.WebRootPath + "\\Images"))
                                {
                                    Directory.CreateDirectory(_environment.WebRootPath + "\\Images\\");
                                }
                                using (FileStream filestream = System.IO.File.Create(_environment.WebRootPath + imgName))
                                {
                                    item.CopyTo(filestream);
                                    filestream.Flush();
                                    //  return "\\Upload\\" + objFile.files.FileName;
                                }
                            }
                            ProductImage productImage = new ProductImage();
                            productImage.ProductId = product.ProductId;
                            productImage.ImageLink = imgName;
                            await _productImageService.Add(productImage);
                        }
                    }
                    
                        
                    return CreatedAtAction(nameof(Create), new { id = model.CatId }, model);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex);
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }


        [HttpGet("getlistpaging")]
        public async Task<IActionResult> GetListPaging(int page = 0, int pageSize = 10, string? keyword = null)
        {
            try
            {
                var model = await _productService.GetAllMapping(keyword);
                int totalRow = 0;
                totalRow = model.Count();
                model = model.Skip(page * pageSize).Take(pageSize);
                var responseData = new PaginationSet<ProductMappingModel>()
                {
                    Items = model,
                    Page = page,
                    TotalCount = totalRow,
                    TotalPages = (int)Math.Ceiling((decimal)totalRow / pageSize)
                };
                return Ok(responseData);
            }
            catch (Exception dex)
            {
                return BadRequest(dex);
            }
        }
        #endregion
    }
}
