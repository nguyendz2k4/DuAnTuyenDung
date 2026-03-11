using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoAnTotNghiep.DTO.admin;
using DoAnTotNghiep.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using AutoMapper;

namespace DoAnTotNghiep.Controllers.admin
{
    [ApiController]
    [Route("admin/[controller]")]
    public class ProfileUser : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public ProfileUser(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<UserInfor>> Profile(int id)
        {
            var user = await _context.DomainUsers.FirstOrDefaultAsync(u => u.UserId == id);
            var result = _mapper.Map<UserInfor>(user);

            if (user.AccountType == "Employer")
            {
                var employer = await _context.Employers
                    .Include(e => e.Industry)
                    .FirstOrDefaultAsync(e => e.UserId == id);

                if (employer != null)
                    _mapper.Map(employer, result);
            }

            return Ok(result);
        }
    }
}
