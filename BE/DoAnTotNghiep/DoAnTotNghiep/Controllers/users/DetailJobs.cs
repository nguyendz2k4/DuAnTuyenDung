using AutoMapper;
using DoAnTotNghiep.DTO;
using DoAnTotNghiep.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Controllers.users
{
    [ApiController]
    [Route("api/[controller]")]
    public class DetailJobs : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public DetailJobs(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<JobDto>> Detail(int id)
        {
            var jobPost = await _context.JobPosts
                .Include(j => j.Category)
                .Include(j => j.Employer)
                    .ThenInclude(e => e.Industry)
                .FirstOrDefaultAsync(j => j.JobId == id);

            if (jobPost == null)
            {
                return NotFound(new { message = "Không tìm thấy bài tuyển dụng này" });
            }

            var jobDto = _mapper.Map<JobDto>(jobPost);

            return Ok(jobDto);
        }
    }
}