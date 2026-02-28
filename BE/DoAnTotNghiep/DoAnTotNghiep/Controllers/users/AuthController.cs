using DoAnTotNghiep.DTO;
using DoAnTotNghiep.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DoAnTotNghiep.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            AppDbContext context,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _configuration = configuration;
        }

        // --- 1. ĐĂNG KÝ ---
        [HttpPost("register")]
        [ProducesResponseType(typeof(RegisterResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<RegisterResponseDTO>> Register([FromBody] RegisterRequestDTO model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                var appUser = new ApplicationUser
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(appUser, model.Password);
                if (!result.Succeeded)
                {
                    return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
                }

                var domainUser = new User
                {
                    IdentityUserId = appUser.Id,
                    FullName = model.FullName,
                    AccountType = model.AccountType,
                    Status = 1,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    IsVerified = 0
                };

                _context.DomainUsers.Add(domainUser);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new RegisterResponseDTO
                {
                    Message = "Đăng ký thành công!",
                    UserId = domainUser.UserId
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Error = "Lỗi hệ thống: " + ex.Message });
            }
        }

        // --- 2. ĐĂNG NHẬP ---
        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<LoginResponseDTO>> Login([FromBody] LoginRequestDTO model)
        {
            // B1: Tìm user trong Identity
            var appUser = await _userManager.FindByEmailAsync(model.UserName); // Thử tìm bằng Email
            if (appUser == null)
                appUser = await _userManager.FindByNameAsync(model.UserName); // Fallback: tìm bằng UserName

            if (appUser == null) return Unauthorized(new { Message = "Tài khoản không tồn tại" });

            // B2: Kiểm tra mật khẩu
            var result = await _signInManager.CheckPasswordSignInAsync(appUser, model.Password, false);
            if (!result.Succeeded) return Unauthorized(new { Message = "Sai mật khẩu" });

            // B3: Lấy thông tin Profile (Bảng User cũ)
            var userProfile = await _context.DomainUsers.FirstOrDefaultAsync(u => u.IdentityUserId == appUser.Id);

            if (userProfile == null)
            {
                return BadRequest(new { Message = "Lỗi dữ liệu: Không tìm thấy hồ sơ người dùng." });
            }

            // B4: Tạo JWT Token
            var token = GenerateJwtToken(appUser, userProfile);

            return Ok(new LoginResponseDTO
            {
                Token = token,
                User = new UserInfoDTO
                {
                    Id = userProfile.UserId,
                    FullName = userProfile.FullName,
                    Email = appUser.Email,
                    UserName = appUser.UserName,
                    Avatar = userProfile.Avatar,
                    Role = userProfile.AccountType
                }
            });
        }
        //Đăng nhập gg
        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponse()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(IdentityConstants.ExternalScheme);
            if (!authenticateResult.Succeeded)
                return BadRequest("Lỗi xác thực Google.");

            var claims = authenticateResult.Principal.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var fullName = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var googleId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var avatar = authenticateResult.Principal.FindFirst("picture")?.Value
          ?? authenticateResult.Principal.FindFirst("urn:google:picture")?.Value
          ?? authenticateResult.Principal.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri")?.Value;


            // SỬA CẢNH BÁO: Kiểm tra luôn googleId để đảm bảo nó không null
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(googleId))
                return BadRequest("Không lấy được thông tin email hoặc ID từ Google.");

            var appUser = await _userManager.FindByEmailAsync(email);

            // SỬA CẢNH BÁO: Thêm dấu ? vào chữ User để báo hiệu biến này có thể null lúc khởi tạo
            User? domainUser = null;

            if (appUser == null)
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    appUser = new ApplicationUser
                    {
                        UserName = email,
                        Email = email,
                        EmailConfirmed = true
                    };
                    var createResult = await _userManager.CreateAsync(appUser);
                    if (!createResult.Succeeded) throw new Exception("Không thể tạo tài khoản Identity");

                    await _userManager.AddLoginAsync(appUser, new UserLoginInfo("Google", googleId, "Google"));

                    domainUser = new User
                    {
                        IdentityUserId = appUser.Id,
                        FullName = fullName,
                        AccountType = "JobSeeker",
                        GoogleId = googleId,
                        Avatar = avatar,
                        Status = 1,
                        IsVerified = 1,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        LastLogin = DateTime.Now
                    };
                    _context.DomainUsers.Add(domainUser);
                    await _context.SaveChangesAsync();

                    var userProfile = new UserProfile
                    {
                        UserId = domainUser.UserId,
                        FullName = fullName,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    };
                    _context.UserProfiles.Add(userProfile);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, $"Lỗi lưu dữ liệu: {ex.Message}");
                }
            }
            else
            {
                domainUser = await _context.DomainUsers.FirstOrDefaultAsync(u => u.IdentityUserId == appUser.Id);
                if (domainUser != null)
                {
                    domainUser.LastLogin = DateTime.Now;
                    domainUser.Avatar = avatar;
                    await _context.SaveChangesAsync();
                }
            }

            // SỬA CẢNH BÁO: Kiểm tra domainUser trước khi tạo Token để chắc chắn nó không null
            if (domainUser == null)
            {
                return BadRequest("Lỗi đồng bộ dữ liệu người dùng.");
            }

            // Lúc này truyền domainUser vào hàm sẽ không còn báo vàng nữa
            var token = GenerateJwtToken(appUser, domainUser);

            var userInfo = new
            {
                Id = domainUser.UserId,
                FullName = domainUser.FullName,
                Email = appUser.Email,
                Role = domainUser.AccountType,
                Avatar = domainUser.Avatar
            };

            var userStr = Uri.EscapeDataString(System.Text.Json.JsonSerializer.Serialize(userInfo));

            return Redirect($"http://localhost:3000/google-callback?token={token}&user={userStr}");
        }

        [HttpGet("google-login")]
        public IActionResult GoogleLogin()
        {
            var redirectUrl = Url.Action("GoogleResponse", "Auth");
            var properties = _signInManager.ConfigureExternalAuthenticationProperties("Google", redirectUrl);
            return Challenge(properties, "Google");
        }

        // --- HÀM TẠO TOKEN ---
        private string GenerateJwtToken(ApplicationUser appUser, User userProfile)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, appUser.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, appUser.Id),
                new Claim("UserId", userProfile.UserId.ToString()),
                new Claim("FullName", userProfile.FullName ?? ""),
                new Claim(ClaimTypes.Role, userProfile.AccountType ?? "User"),
                new Claim(ClaimTypes.Email, appUser.Email ?? "")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? "Day_La_Key_Bi_Mat_Cua_Ban_Phai_Rat_Dai_Nhe_@@@123"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(1);

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"] ?? "TuyenDungApp",
                _configuration["Jwt:Audience"] ?? "TuyenDungClient",
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}