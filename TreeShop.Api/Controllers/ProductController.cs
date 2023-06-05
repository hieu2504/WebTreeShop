using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
        /// Them moi san pham
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


        /// <summary>
        /// Chỉnh sửa san pham
        /// </summary>
        /// <param name="categoryViewModel"></param>
        /// <returns></returns>
        [HttpPost("Update"), DisableRequestSizeLimit]
        [AllowAnonymous]
        public async Task<IActionResult> Update([FromForm] ProductViewModel productViewModel)
        {
            if (ModelState.IsValid)
            {

                var model = _mapper.Map<ProductViewModel, Product>(productViewModel);
                if (!string.IsNullOrEmpty(productViewModel.lstProImage))
                {
                    var listItem = JsonConvert.DeserializeObject<List<int>>(productViewModel.lstProImage);
                        foreach (var item in listItem)
                        {
                            var resDel = await _productImageService.Delete(item);
                            string path = _environment.WebRootPath + resDel.ImageLink;
                            FileInfo file = new FileInfo(path);
                            if (file.Exists)//check file exsit or not  
                            {
                                file.Delete();
                            }
                        }
                }
                try
                {
                    model.UpdatedDate = model.CreatedDate;

                    var product = await _productService.Update(model);

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

        [HttpGet("getbyid/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _productService.GetByIdMapping(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete("DeleteMulti")]
        public async Task<IActionResult> DeleteMulti(string checkedList)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                try
                {
                    int countSuccess = 0;
                    int countError = 0;
                    List<int> result = new List<int>();
                    var listItem = JsonConvert.DeserializeObject<List<int>>(checkedList);
                    foreach (var item in listItem)
                    {
                        try
                        {
                            var model = await _productService.GetById(item);
                            model.IsActive = false;
                            await _productService.Update(model);
                            countSuccess++;
                        }
                        catch (Exception)
                        {
                            countError++;
                        }
                    }
                    result.Add(countSuccess);
                    result.Add(countError);

                    return Ok(result);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpGet("getlistpaging_shop")]
        public async Task<IActionResult> GetListPagingShop(int page = 0, int pageSize = 10, string? keyword = null, bool? bestSellers = false, int? catId = 0)
        {
            try
            {
                var model = await _productService.GetProductShop(keyword);
                if ((bool)bestSellers)
                {
                    model = model.Where(x => x.BestSellers == bestSellers);
                }
                if (catId != 0)
                {
                    model = model.Where(x => x.CatId == catId);
                }
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

        [HttpGet("getlist_order_shop")]
        public async Task<IActionResult> GetListOrderShop(string strLstOrder)
        {
            try
            {
                List<OrderRequestModel> lstOrder = JsonConvert.DeserializeObject<List<OrderRequestModel>>(strLstOrder);
                var model = await _productService.GetListOrderShop(lstOrder);
                return Ok(model);
            }
            catch (Exception dex)
            {
                return BadRequest(dex);
            }
        }

        #endregion
    }
}
