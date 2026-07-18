using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoAnTotNghiep.Models;
using DoAnTotNghiep.DTO.admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;


namespace DoAnTotNghiep.Controllers.admin
{
    [ApiController]
    [Authorize(Roles = "Admin")]
    [Route("admin/[controller]")]
    public class ManagementAcc : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        public ManagementAcc(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        [HttpPost("account-manage")]
        public async Task<IActionResult> CreateAdminAccount([FromForm] AccountsDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var emailExists = await _context.Users.AnyAsync(u => u.Email == model.Email);
                if (emailExists)
                    return BadRequest(new { message = "Email đã tồn tại!" });

                var identityUser = new ApplicationUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(identityUser, model.Password);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                // Role is selected by the server. The caller never controls privileges.
                var roleResult = await _userManager.AddToRoleAsync(identityUser, "Admin");
                if (!roleResult.Succeeded)
                    return BadRequest(roleResult.Errors);

                var newUser = new User
                {
                    FullName = model.Username,
                    IdentityUserId = identityUser.Id,
                    Status = 1,
                    CreatedAt = DateTime.Now,
                    IsVerified = 0
                };

                _context.DomainUsers.Add(newUser);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return StatusCode(StatusCodes.Status201Created, new
                {
                    message = "Tạo tài khoản quản trị viên thành công.",
                    userId = newUser.UserId
                });
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
