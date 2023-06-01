using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data;
using System.Net.Http.Headers;
using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Core;
using TreeShop.Api.Service;
using TreeShop.Api.ViewModel;

namespace TreeShop.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        #region Initial
        private readonly ICategoryService _categoryService;

        private readonly IMapper _mapper;
        public static IWebHostEnvironment _environment;


        public CategoryController(ICategoryService categoryService, IMapper mapper, IWebHostEnvironment environment)
        {
            _categoryService = categoryService;
            _mapper = mapper;
            _environment = environment;
        }
        #endregion Initial

        #region Properties
        /// <summary>
        /// get danh sách loai san pham
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var model = await _categoryService.GetAll();
                var mapping = _mapper.Map<IEnumerable<Category>, IEnumerable<CategoryViewModel>>(model.OrderByDescending(x => x.Name));
                return Ok(mapping);
            }
            catch (Exception dex)
            {
                return BadRequest(dex);
            }
        }

        /// <summary>
        /// Them moi loai san pham
        /// </summary>
        /// <param name="categoryViewModel"></param>
        /// <returns></returns>
        [HttpPost("Create"),DisableRequestSizeLimit]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromForm] CategoryViewModel categoryViewModel)
        {
            if (ModelState.IsValid)
            {
                
                var model = _mapper.Map<CategoryViewModel, Category>(categoryViewModel);
                try
                {
                    
                    if (categoryViewModel.Files != null)
                    {
                        var imgName = "\\Images\\" + DateTime.Now.ToString("yyyyMMddHHmmss") + categoryViewModel.Files.FileName;
                        if (!Directory.Exists(_environment.WebRootPath + "\\Images"))
                        {
                            Directory.CreateDirectory(_environment.WebRootPath + "\\Images\\");
                        }
                        using (FileStream filestream = System.IO.File.Create(_environment.WebRootPath + imgName))
                        {
                            categoryViewModel.Files.CopyTo(filestream);
                            filestream.Flush();
                            //  return "\\Upload\\" + objFile.files.FileName;
                        }
                        model.Icon = imgName;
                    }
                    
                    model.CreatedDate = DateTime.Now;
                    model.UpdatedDate = model.CreatedDate;
                    await _categoryService.Add(model);
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

        [HttpPost("CreateNew"), DisableRequestSizeLimit]
        [AllowAnonymous]
        public async Task<IActionResult> CreateNew()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                if(file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    using (var steam = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(steam);
                    }
                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
        }


        [HttpPost("CreateNew1"), DisableRequestSizeLimit]
        public async Task<ActionResult> Post([FromForm] FileUploadAPI objFile)
        {
            try
            {

                //var imgName = "\\Images\\" + objFile.files.FileName;
                //if (objFile.files.Length > 0)
                //{
                //    if (!Directory.Exists(_environment.WebRootPath + "\\Images"))
                //    {
                //        Directory.CreateDirectory(_environment.WebRootPath + "\\Images\\");
                //    }
                //    using (FileStream filestream = System.IO.File.Create(_environment.WebRootPath + "\\Images\\" + objFile.files.FileName))
                //    {
                //        objFile.files.CopyTo(filestream);
                //        filestream.Flush();
                //        //  return "\\Upload\\" + objFile.files.FileName;
                //    }
                //}

                foreach(var item in objFile.lstFiles)
                {
                    var imgName = "\\Images\\" + item.FileName;
                    if (item.Length > 0)
                    {
                        if (!Directory.Exists(_environment.WebRootPath + "\\Images"))
                        {
                            Directory.CreateDirectory(_environment.WebRootPath + "\\Images\\");
                        }
                        using (FileStream filestream = System.IO.File.Create(_environment.WebRootPath + "\\Images\\" + item.FileName))
                        {
                            item.CopyTo(filestream);
                            filestream.Flush();
                            //  return "\\Upload\\" + objFile.files.FileName;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return Ok("ABC");
        }

        /// <summary>
        /// Them moi loai san pham
        /// </summary>
        /// <param name="categoryViewModel"></param>
        /// <returns></returns>
        [HttpPost("Update"), DisableRequestSizeLimit]
        [AllowAnonymous]
        public async Task<IActionResult> Update([FromForm] CategoryViewModel categoryViewModel)
        {
            if (ModelState.IsValid)
            {

                var model = _mapper.Map<CategoryViewModel, Category>(categoryViewModel);
                try
                {
                    
                    if (categoryViewModel.Files !=null)
                    {

                        var imgName = "\\Images\\" + DateTime.Now.ToString("yyyyMMddHHmmss") + categoryViewModel.Files.FileName;
                        if (!Directory.Exists(_environment.WebRootPath + "\\Images"))
                        {
                            Directory.CreateDirectory(_environment.WebRootPath + "\\Images\\");
                        }
                        using (FileStream filestream = System.IO.File.Create(_environment.WebRootPath + imgName))
                        {
                            categoryViewModel.Files.CopyTo(filestream);
                            filestream.Flush();
                            //  return "\\Upload\\" + objFile.files.FileName;
                        }
                        string path = _environment.WebRootPath + model.Icon;
                        FileInfo file = new FileInfo(path);
                        if (file.Exists)//check file exsit or not  
                        {
                            file.Delete();
                        }
                        model.Icon = imgName;

                    }
                    
                    model.UpdatedDate = DateTime.Now;
                    await _categoryService.Update(model);
                    return CreatedAtAction(nameof(Update), new { id = model.CatId }, model);
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
                var model = await _categoryService.GetAll(keyword);
                int totalRow = 0;
                totalRow = model.Count();
                model = model.Skip(page * pageSize).Take(pageSize);
                var result = _mapper.Map<IEnumerable<Category>, IEnumerable<CategoryViewModel>>(model);
                var responseData = new PaginationSet<CategoryViewModel>()
                {
                    Items = result,
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
        /// Xem thông tin chi tiết loại sản phẩm
        /// </summary>
        /// <param name="request"></param>
        /// <param name="id">id loại sản phẩm</param>
        /// <returns></returns>
        [HttpGet("getbyid/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var model = await _categoryService.GetById(id);
                var mapping = _mapper.Map<Category, CategoryViewModel>(model);
                return Ok(mapping);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var category = await _categoryService.Delete(id);
                var responseData = _mapper.Map<Category, CategoryViewModel>(category);
                return Ok(responseData);
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
                            var model = await _categoryService.Delete(item);
                            string path = _environment.WebRootPath + model.Icon;
                            FileInfo file = new FileInfo(path);
                            if (file.Exists)//check file exsit or not  
                            {
                                file.Delete();
                            }
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

        #endregion Properties
    }
}
