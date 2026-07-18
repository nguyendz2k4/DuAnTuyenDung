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
            var user = await _context.DomainUsers
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
                return NotFound();

            var result = _mapper.Map<UserInfor>(user);

            return Ok(result);
        }
    }
}
