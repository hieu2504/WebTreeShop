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
using TreeShop.Api.MappingModel;
using TreeShop.Api.Service;
using TreeShop.Api.ViewModel;

namespace TreeShop.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        #region Initial
        private readonly IOrderService _orderService;
        private readonly IOrderDetailService _orderDetailService;

        private readonly IMapper _mapper;
        public static IWebHostEnvironment _environment;


        public OrderController(IOrderService orderService, IMapper mapper, IWebHostEnvironment environment, IOrderDetailService orderDetailService)
        {
            _orderService = orderService;
            _mapper = mapper;
            _environment = environment;
            _orderDetailService = orderDetailService;
        }
        #endregion Initial

        #region Properties
        ///// <summary>
        ///// get danh sách loai san pham
        ///// </summary>
        ///// <returns></returns>
        //[HttpGet("GetAll")]
        //public async Task<IActionResult> GetAll()
        //{
        //    try
        //    {
        //        var model = await _categoryService.GetAll();
        //        var mapping = _mapper.Map<IEnumerable<Category>, IEnumerable<CategoryViewModel>>(model.OrderByDescending(x => x.Name));
        //        return Ok(mapping);
        //    }
        //    catch (Exception dex)
        //    {
        //        return BadRequest(dex);
        //    }
        //}

        /// <summary>
        /// Them moi đơn hàng
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [HttpPost("Create")]
        [AllowAnonymous]
        public async Task<IActionResult> Create(OrderViewModel orderViewModel)
        {
            if (ModelState.IsValid)
            {
                
                var model = _mapper.Map<OrderViewModel, Order>(orderViewModel);
                try
                {
                    model.OrderDate = DateTime.Now;
                    model.TransactStatusId = 1;
                    model.PaymentId = 1;
                    var rsOrder = await _orderService.Add(model);
                    if(rsOrder != null)
                    {
                        if (orderViewModel.lstOrderDetails.Count > 0)
                        {
                            foreach(var item in orderViewModel.lstOrderDetails)
                            {
                                var orderDetail = _mapper.Map<OrderDetailViewModel, OrderDetail>(item);
                                orderDetail.OrderId = rsOrder.OrderId;
                                await _orderDetailService.Add(orderDetail);
                            }
                        }
                        
                    }
                    return CreatedAtAction(nameof(Create), new { id = model.OrderId }, model);
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

        /// <summary>
        /// Them moi don hang
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [HttpPost("Update"), DisableRequestSizeLimit]
        [AllowAnonymous]
        public async Task<IActionResult> Update(OrderViewModel orderViewModel)
        {
            if (ModelState.IsValid)
            {

                var model = _mapper.Map<OrderViewModel, Order>(orderViewModel);
                try
                {
                    model.OrderDate = DateTime.Now;
                    model.TransactStatusId = 1;
                    model.PaymentId = 1;
                    var rsOrder = await _orderService.Add(model);
                    if (rsOrder != null)
                    {
                        if (orderViewModel.lstOrderDetails.Count > 0)
                        {
                            foreach (var item in orderViewModel.lstOrderDetails)
                            {
                                var orderDetail = _mapper.Map<OrderDetailViewModel, OrderDetail>(item);
                                await _orderDetailService.Add(orderDetail);
                            }
                        }

                    }
                    return CreatedAtAction(nameof(Create), new { id = model.OrderId }, model);
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

        [HttpGet("getallorder")]
        public async Task<IActionResult> GetAllOrder(DateTime fromDate, DateTime toDate, int payId = 0, int transId = 0, int page = 0, int pageSize = 10)
        {
            try
            {

                var model = await _orderService.GetAllOrder(fromDate.ToString("yyyy-MM-dd HH:mm:ss"), toDate.ToString("yyyy-MM-dd HH:mm:ss"), payId, transId);
                int totalRow = 0;
                totalRow = model.Count();
                model = model.Skip(page * pageSize).Take(pageSize);
                var responseData = new PaginationSet<OrderMapping>()
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

        //[HttpGet("getlistpaging")]
        //public async Task<IActionResult> GetListPaging(int page = 0, int pageSize = 10, string? keyword = null)
        //{
        //    try
        //    {
        //        var model = await _categoryService.GetAll(keyword);
        //        int totalRow = 0;
        //        totalRow = model.Count();
        //        model = model.Skip(page * pageSize).Take(pageSize);
        //        var result = _mapper.Map<IEnumerable<Category>, IEnumerable<CategoryViewModel>>(model);
        //        var responseData = new PaginationSet<CategoryViewModel>()
        //        {
        //            Items = result,
        //            Page = page,
        //            TotalCount = totalRow,
        //            TotalPages = (int)Math.Ceiling((decimal)totalRow / pageSize)
        //        };
        //        return Ok(responseData);
        //    }
        //    catch (Exception dex)
        //    {
        //        return BadRequest(dex);
        //    }
        //}

        ///// <summary>
        ///// Xem thông tin chi tiết loại sản phẩm
        ///// </summary>
        ///// <param name="request"></param>
        ///// <param name="id">id loại sản phẩm</param>
        ///// <returns></returns>
        //[HttpGet("getbyid/{id}")]
        //public async Task<IActionResult> GetById(int id)
        //{
        //    try
        //    {
        //        var model = await _categoryService.GetById(id);
        //        var mapping = _mapper.Map<Category, CategoryViewModel>(model);
        //        return Ok(mapping);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex);
        //    }
        //}

        //[HttpDelete("Delete/{id}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    try
        //    {
        //        var category = await _categoryService.Delete(id);
        //        var responseData = _mapper.Map<Category, CategoryViewModel>(category);
        //        return Ok(responseData);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex);
        //    }
        //}

        //[HttpDelete("DeleteMulti")]
        //public async Task<IActionResult> DeleteMulti(string checkedList)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }
        //    else
        //    {
        //        try
        //        {
        //            int countSuccess = 0;
        //            int countError = 0;
        //            List<int> result = new List<int>();
        //            var listItem = JsonConvert.DeserializeObject<List<int>>(checkedList);
        //            foreach (var item in listItem)
        //            {
        //                try
        //                {
        //                    var model = await _categoryService.Delete(item);
        //                    string path = _environment.WebRootPath + model.Icon;
        //                    FileInfo file = new FileInfo(path);
        //                    if (file.Exists)//check file exsit or not  
        //                    {
        //                        file.Delete();
        //                    }
        //                    countSuccess++;
        //                }
        //                catch (Exception)
        //                {
        //                    countError++;
        //                }
        //            }
        //            result.Add(countSuccess);
        //            result.Add(countError);

        //            return Ok(result);
        //        }
        //        catch (Exception ex)
        //        {
        //            return BadRequest(ex.Message);
        //        }
        //    }
        //}

        #endregion Properties
    }
}
