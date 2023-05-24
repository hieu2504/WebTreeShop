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
    public class TransactStatusController : ControllerBase
    {
        #region Initial
        private readonly ITransactStatusService _transactStatusService;

        private readonly IMapper _mapper;
        public static IWebHostEnvironment _environment;


        public TransactStatusController(ITransactStatusService transactStatusService, IMapper mapper, IWebHostEnvironment environment)
        {
            _transactStatusService = transactStatusService;
            _mapper = mapper;
            _environment = environment;
        }
        #endregion Initial

        #region Properties
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var model = await _transactStatusService.GetAll();
                var mapping = _mapper.Map<IEnumerable<TransactStatus>, IEnumerable<TransactStatusViewModel>>(model);
                return Ok(mapping);
            }
            catch (Exception dex)
            {
                return BadRequest(dex);
            }
        }

        #endregion Properties
    }
}
