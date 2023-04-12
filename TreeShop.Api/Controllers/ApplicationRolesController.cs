using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Core;
using TreeShop.Api.Infrastructure.Extention;
using TreeShop.Api.Service;
using TreeShop.Api.ViewModel;

namespace TreeShop.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ApplicationRolesController : ControllerBase
    {
        private readonly IApplicationRoleService _applicationRoleService;
        private readonly IMapper _mapper;

        public ApplicationRolesController(IApplicationRoleService applicationRoleService, IMapper mapper)
        {
            _applicationRoleService = applicationRoleService;
            _mapper = mapper;
        }

        /// <summary>
        /// Get danh sách quyền phân trang
        /// </summary>
        /// <param name="request"></param>
        /// <param name="page">Trang thứ</param>
        /// <param name="pageSize">Số bản ghi hiển thị trong 1 trang</param>
        /// <param name="filter">Từ khóa tìm kiếm</param>
        /// <returns></returns>
        [HttpGet("getlistpaging")]
        //[Authorize(Roles = "ViewRole")]
        [AllowAnonymous]
        public async Task<IActionResult> GetListPaging(int page = 0, int pageSize = 100, string? keyword = null)
        {
            try
            {
                int totalRow = 0;
                var model = await _applicationRoleService.GetAll(keyword);
                totalRow = model.Count();
                var paging = model.OrderByDescending(x => x.CreatedDate).Skip(page * pageSize).Take(pageSize);
                IEnumerable<AppRoleViewModel> modelVm = _mapper.Map<IEnumerable<AppRole>, IEnumerable<AppRoleViewModel>>(paging);

                PaginationSet<AppRoleViewModel> pagedSet = new PaginationSet<AppRoleViewModel>()
                {
                    Page = page,
                    TotalCount = totalRow,
                    TotalPages = (int)Math.Ceiling((decimal)totalRow / pageSize),
                    Items = modelVm
                };

                return Ok(pagedSet);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        /// <summary>
        /// Get danh sách quyền
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("getall")]
        //[Authorize(Roles = "ViewRole")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var model = await _applicationRoleService.GetAll();
                IEnumerable<AppRoleViewModel> modelVm = _mapper.Map<IEnumerable<AppRole>, IEnumerable<AppRoleViewModel>>(model.OrderByDescending(x => x.CreatedDate));

                return Ok(modelVm);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        /// <summary>
        /// Thêm mới quyền
        /// </summary>
        /// <param name="request"></param>
        /// <param name="AppRoleViewModel"></param>
        /// <returns></returns>
        [HttpPost("create")]
        [AllowAnonymous]
        //[Authorize(Roles = "CreateRole")]
        public async Task<IActionResult> Create(AppRoleViewModel AppRoleViewModel)
        {
            if (ModelState.IsValid)
            {
                var newAppRole = new AppRole();
                newAppRole.UpdateApplicationRole(AppRoleViewModel, "add");
                newAppRole.CreatedDate = DateTime.Now;
                //newAppRole.Id = Guid.NewGuid().ToString();
                try
                {
                    var role = await _applicationRoleService.Add(newAppRole);
                    var result = _mapper.Map<AppRole, AppRoleViewModel>(role);
                    return CreatedAtAction(nameof(Create), new { id = result.Id }, result);
                }
                catch (NameDuplicatedException dex)
                {
                    return BadRequest(dex);
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
        /// Thêm mới quyền
        /// </summary>
        /// <param name="request"></param>
        /// <param name="AppRoleViewModel"></param>
        /// <returns></returns>
        [HttpGet("getrolebyuserid")]
        //[Authorize(Roles = "CreateRole")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRoleByUserId()
        {
            return Ok("Adhihi");
        }


        /// <summary>
        /// Thêm mới quyền
        /// </summary>
        /// <param name="request"></param>
        /// <param name="AppRoleViewModel"></param>
        /// <returns></returns>
        [HttpPost("getrolebyuserid1")]
        [Authorize(Roles = "CreateRole234")]
        public async Task<IActionResult> GetRoleByUserId1(string userId)
        {
            return Ok("Adhihi");
        }
    }
}
