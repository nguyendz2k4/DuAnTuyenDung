using DoAnTotNghiep.DTO.users;
using DoAnTotNghiep.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Controllers.users
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompanyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CompanyController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<CompanyListDto>>> GetEmployers()
        {
            var result = await _context.JobPosts
                .AsNoTracking()
                .Where(j => j.EmployerId != null) 
                .GroupBy(j => new
                {
                    j.EmployerId,
                    CompanyName = j.Employer != null ? j.Employer.CompanyName : null,
                    Logo = j.Employer != null ? j.Employer.Logo : null
                })
                .Select(g => new CompanyListDto
                {
                    EmployerId = g.Key.EmployerId, 
                    CompanyName = g.Key.CompanyName,
                    CompanyLogo = g.Key.Logo,
                    JobCount = g.Count()
                })
                .ToListAsync();

            return Ok(result);
        }
    }
}
