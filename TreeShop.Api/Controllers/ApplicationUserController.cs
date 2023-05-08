using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Core;
using TreeShop.Api.Infrastructure.Extention;
using TreeShop.Api.Service;
using TreeShop.Api.ViewModel;

namespace TreeShop.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUserController : ControllerBase
    {
        #region Intialize

        private readonly UserManager<AppUser> _userManager;
        private readonly IApplicationUserService _applicationUserService;
        private readonly IApplicationRoleService _applicationRoleService;
        private readonly IApplicationUserRoleService _applicationUserRoleService;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        //private readonly ITAccountService _iTAccountService;

        public ApplicationUserController( UserManager<AppUser> userManager, IApplicationUserService applicationUserService, IConfiguration configuration, IMapper mapper, IApplicationRoleService applicationRoleService, IApplicationUserRoleService applicationUserRoleService)
        {
            _userManager = userManager;
            _applicationUserService = applicationUserService;
            _applicationRoleService = applicationRoleService;
            _configuration = configuration;
            _mapper = mapper;
            _applicationUserRoleService = applicationUserRoleService;
            //_iTAccountService = tAccountService;
        }

        #endregion Intialize

        //[HttpPost("login")]
        //[AllowAnonymous]
        //public async Task<ActionResult<LoginResponseModel>> Login(LoginRequestModel model)
        //{
        //    try
        //    {
        //        var user = await _userManager.FindByNameAsync(model.UserName);

        //        if (user == null)
        //        {
        //            return Unauthorized();
        //        }

        //        var passwordValid = await _userManager.CheckPasswordAsync(user, model.Password);
        //        List<string> roles = (List<string>)await _userManager.GetRolesAsync(user);
        //        if (!passwordValid)
        //        {
        //            return Unauthorized();
        //        }
        //        var token = this._identityService.GenerateJwtToken(
        //            user.Id,
        //            user.UserName,
        //            roles,
        //            this._appSettings.Secret);

        //        return new LoginResponseModel
        //        {
        //            Id = user.Id,
        //            EmId = user.EM_ID,
        //            Access_token = "Bearer " + token,
        //            UserName = user.UserName,
        //            FullName = user.FullName,
        //            Email = user.Email,
        //            Image = user.Image,
        //            DepIdList = depIdList
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex);
        //    }
        //}


        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    );

                return Ok(new
                {
                    access_token = "Bearer " + new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    id = user.Id,
                    username = user.UserName,
                    fullname = user.FullName,
                    email = user.Email,
                    address = user.Address,
                    phonenumber = user.PhoneNumber,
                    image = user.Image,
                    type = user.Type
                });
            }
            return Unauthorized();
        }


        /// <summary>
        /// Thêm mới tài khoản
        /// </summary>
        /// <param name="AppUserViewModel"></param>
        /// <returns></returns>
        [HttpPost("create")]
        [AllowAnonymous]
        public async Task<IActionResult> Create(AppUserViewModel AppUserViewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    AppUser appUser = new AppUser();
                    appUser.UpdateUser(AppUserViewModel, "add");
                    
                    var result = await _userManager.CreateAsync(appUser, AppUserViewModel.PasswordHash);
                    if (result.Succeeded)
                    {
                        var listAppRole = AppUserViewModel.LstRoleId;
                        if (listAppRole.Count != 0)
                        {
                            foreach (var item in listAppRole)
                            {
                               await _userManager.RemoveFromRoleAsync(appUser, item);
                               await _userManager.AddToRoleAsync(appUser, item);
                            }
                        }

                        return CreatedAtAction(nameof(Create), appUser);
                    }
                    else
                    {
                        return BadRequest(result.Errors);
                    }
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
        /// Chỉnh sửa tài khoản
        /// </summary>
        /// <param name="AppUserViewModel"></param>
        /// <returns></returns>
        [HttpPost("update")]
        [AllowAnonymous]
        public async Task<IActionResult> Update(AppUserViewModel AppUserViewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    AppUser appUser = await _userManager.FindByIdAsync(AppUserViewModel.Id);
                    var oldUserName = appUser.UserName;
                    appUser.UpdateUser(AppUserViewModel, "update");
                    if (!string.IsNullOrEmpty(AppUserViewModel.PasswordHash))
                    {
                        appUser.PasswordHash = _userManager.PasswordHasher.HashPassword(appUser, AppUserViewModel.PasswordHash);
                    }
                    var result = await _userManager.UpdateAsync(appUser);
                    if (result.Succeeded)
                    {
                        var listRole = await _applicationRoleService.GetAll();
                        foreach (var role in listRole)
                        {
                            await _userManager.RemoveFromRoleAsync(appUser, role.Name);
                        }
                        var listAppRole = AppUserViewModel.LstRoleId;
                        if (listAppRole.Count != 0)
                        {
                            foreach (var item in listAppRole)
                            {
                                await _userManager.RemoveFromRoleAsync(appUser, item);
                                await _userManager.AddToRoleAsync(appUser, item);
                            }
                        }
                        return CreatedAtAction(nameof(Update), appUser);
                    }
                    else
                        return BadRequest(result.Errors);
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
        /// Get danh sách user phân trang
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
                var model = (await _applicationUserService.GetAll(keyword)).Where(x=>x.Type == 1);
                totalRow = model.Count();
                var paging = model.OrderByDescending(x => x.UpdatedDate).Skip(page * pageSize).Take(pageSize);
                IEnumerable<AppUserViewModel> modelVm = _mapper.Map<IEnumerable<AppUser>, IEnumerable<AppUserViewModel>>(paging);

                PaginationSet<AppUserViewModel> pagedSet = new PaginationSet<AppUserViewModel>()
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
        /// Xóa nhiều tài khoản
        /// </summary>
        /// <param name="checkedList"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpDelete("deletemulti")]
        //[Authorize(Roles = "DeleteUser")]
        public async Task<IActionResult> DeleteMulti(string checkedList)
        {
            try
            {
                
                int countSuccess = 0;
                int countError = 0;
                List<string> result = new List<string>();
                var listItem = JsonConvert.DeserializeObject<List<string>>(checkedList);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
                foreach (var item in listItem)
#pragma warning restore CS8602 // Dereference of a possibly null reference.
                {
                    try
                    {
                        var lstRole = await _applicationUserRoleService.GetAllUserRole(item);
                        AppUser appUser = await _userManager.FindByIdAsync(item);
                        foreach (var role in lstRole)
                        {
                            await _userManager.RemoveFromRoleAsync(appUser, role);
                        }
                        var res = await _userManager.DeleteAsync(appUser);
                        countSuccess++;
                    }
                    catch (Exception)
                    {
                        countError++;
                    }
                }
                result.Add("Xóa thành công: " + countSuccess);
                result.Add("Lỗi" + countError);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
