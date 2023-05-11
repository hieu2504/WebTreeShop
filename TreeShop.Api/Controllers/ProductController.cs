using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TreeShop.Api.Data;
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
                    
                    if (productViewModel.lstFiles != null)
                    {
                        
                    }
                    var product = await _productService.Add(model);
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
        #endregion
    }
}
