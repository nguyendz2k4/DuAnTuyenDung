using DoAnTotNghiep.Models;
using DoAnTotNghiep.DTO;
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
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // B1: Tạo tài khoản đăng nhập (Identity)
                var appUser = new ApplicationUser
                {
                    UserName = model.UserName, // Lấy UserName từ DTO của bạn
                    Email = model.Email,
                    EmailConfirmed = true // Tạm thời active luôn
                };

                var result = await _userManager.CreateAsync(appUser, model.Password);
                if (!result.Succeeded)
                {
                    return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
                }

                // B2: Tạo hồ sơ người dùng (Bảng User cũ)
                var domainUser = new User
                {
                    IdentityUserId = appUser.Id, // <--- MẤU CHỐT: LIÊN KẾT 2 BẢNG
                    FullName = model.FullName,
                    AccountType = model.AccountType, // Lấy AccountType từ DTO (mặc định là JobSeeker)
                    Status = 1,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    IsVerified = 0
                };

                _context.DomainUsers.Add(domainUser);
                await _context.SaveChangesAsync();

                // B3: Commit Transaction
                await transaction.CommitAsync();

                return Ok(new { Message = "Đăng ký thành công!", UserId = domainUser.UserId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Error = "Lỗi hệ thống: " + ex.Message });
            }
        }

        // --- 2. ĐĂNG NHẬP ---
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO model)
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
                // Trường hợp hy hữu: Có tk Identity nhưng chưa có Profile (dữ liệu lỗi)
                return BadRequest(new { Message = "Lỗi dữ liệu: Không tìm thấy hồ sơ người dùng." });
            }

            // B4: Tạo JWT Token
            var token = GenerateJwtToken(appUser, userProfile);

            return Ok(new
            {
                Token = token,
                User = new
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

        // --- HÀM TẠO TOKEN ---
        private string GenerateJwtToken(ApplicationUser appUser, User userProfile)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, appUser.Id), // ID của Identity (GUID)
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, appUser.Id),
                
                // Thêm các thông tin nghiệp vụ vào Token để React dễ dùng
                new Claim("UserId", userProfile.UserId.ToString()), // ID int của bảng cũ
                new Claim("FullName", userProfile.FullName ?? ""),
                new Claim(ClaimTypes.Role, userProfile.AccountType ?? "User"),
                new Claim(ClaimTypes.Email, appUser.Email ?? "")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "Day_La_Key_Bi_Mat_Cua_Ban_Phai_Rat_Dai_Nhe_@@@123"));
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