using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TreeShop.Api.Service;

namespace TreeShop.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppUserRoleController : ControllerBase
    {
        #region Intialize

        private readonly IApplicationUserRoleService _applicationUserRoleService;
        private readonly IMapper _mapper;

        public AppUserRoleController(IApplicationUserRoleService applicationUserRoleService, IMapper mapper)
        {
            _applicationUserRoleService = applicationUserRoleService;
            _mapper = mapper;
        }

        #endregion Intialize

        #region Properties

        /// <summary>
        /// Get danh sách roles
        /// </summary>
        /// <returns></returns>
        [HttpGet("getuserroleid")]
        public async Task<IActionResult> GetUserRoleId(string userId)
        {
            try
            {
                var model = await _applicationUserRoleService.GetAllUserRole(userId);

                return Ok(model);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        #endregion Properties
    }
}
