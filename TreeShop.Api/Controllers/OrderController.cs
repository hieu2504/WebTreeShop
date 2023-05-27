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
        public async Task<IActionResult> GetAllOrder(DateTime fromDate, DateTime toDate, int payId = 0, int transId = 0, int page = 0, int pageSize = 10, string? fullName = "", string? phoneNumber ="" )
        {
            try
            {

                var model = await _orderService.GetAllOrder(fromDate.ToString("yyyy-MM-dd HH:mm:ss"), toDate.ToString("yyyy-MM-dd HH:mm:ss"), payId, transId, fullName, phoneNumber);
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

        [HttpGet("getallrevenue")]
        public async Task<IActionResult> GetAllRevenue(DateTime fromDate, DateTime toDate, int page = 0, int pageSize = 10)
        {
            try
            {

                var model = await _orderService.GetRevenue(fromDate.ToString("yyyy-MM-dd HH:mm:ss"), toDate.ToString("yyyy-MM-dd HH:mm:ss"));
                int totalRow = 0;
                totalRow = model.Count();
                model = model.Skip(page * pageSize).Take(pageSize);
                var totalRevenue = 0;
                foreach(var item in model)
                {
                    if (item.TotalOrder != null)
                    {
                        totalRevenue += (int)item.TotalOrder;
                    }
                }
                var responseData = new PaginationSet<RevenueStatisticMapping>()
                {
                    Items = model,
                    Page = page,
                    TotalCount = totalRow,
                    TotalPages = (int)Math.Ceiling((decimal)totalRow / pageSize),
                    Total = totalRevenue
                };
                return Ok(responseData);
            }
            catch (Exception dex)
            {
                return BadRequest(dex);
            }
        }

        [HttpGet("getbyid/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _orderService.GetProductOrderById(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("UpdateOrder")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateOrder(OrderUpdateRequestModel orderUpdateRequestModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var model = await _orderService.GetOrderByIdNoTracking(orderUpdateRequestModel.OrderId);
                    if (model != null)
                    {
                        model.TransactStatusId = orderUpdateRequestModel.TransactStatusId;
                        model.PaymentId = orderUpdateRequestModel.PayId;
                        model.Note = orderUpdateRequestModel.Note;
                        model.ShippingAddress = orderUpdateRequestModel.ShippingAddress;
                        if(orderUpdateRequestModel.TransactStatusId == 3)
                        {
                            model.ShipDate = DateTime.Now;
                        }
                        if(orderUpdateRequestModel.TransactStatusId == 4)
                        {
                            model.ShipDate = DateTime.Now;
                            model.Paid = true;
                            model.PaymentDate = DateTime.Now;
                        }

                        var rsOrder = await _orderService.Update(model);

                    }
                    return CreatedAtAction(nameof(UpdateOrder), new { id = model.OrderId }, model);
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

        #endregion Properties
    }
}
