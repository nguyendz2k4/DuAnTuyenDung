using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoAnTotNghiep.Models;
using DoAnTotNghiep.DTO.admin;
using AutoMapper;
using Microsoft.AspNetCore.Identity;


namespace DoAnTotNghiep.Controllers.admin
{
    [ApiController]
    [Route("admin/[controller]")]
    public class ManagementAcc : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<IdentityUser> _userManager;
        public ManagementAcc(AppDbContext context, IMapper mapper, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
        }
        [HttpPost("account-manage")]
        public async Task<ActionResult<AccountsDTO>> createaccount([FromForm] AccountsDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            bool emailExists = await _context.Users
                .AnyAsync(u => u.Email == model.Email);
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

            await _userManager.AddToRoleAsync(identityUser, model.AccountType);
            var newUser = new User
            {
                FullName = model.Username,
                AccountType = model.AccountType,
                IdentityUserId = identityUser.Id,
                Status = 1,
                CreatedAt = DateTime.Now,
                IsVerified = 0
            };
            _context.DomainUsers.Add(newUser);
            await _context.SaveChangesAsync();
            if (model.AccountType == "Admin")
            {
                var adminUser = new ApplicationUser
                {
                    UserName = model.Username,
                    Email = model.Email,
                    EmailConfirmed = true
                };
                var reslt = await _userManager.CreateAsync(adminUser, model.Password);
                if (reslt.Succeeded)
                {
                    await _userManager.AddToRoleAsync(adminUser, "Admin");
                }

            }
            else if (model.AccountType == "Employer")
            {
                var employer = _mapper.Map<Employer>(model);
                employer.UserId = newUser.UserId;
                _context.Employers.Add(employer);
                await _context.SaveChangesAsync();
            }
            return Ok(model);
        }
    }
}
