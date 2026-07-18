using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using DoAnTotNghiep.Models;
using DoAnTotNghiep.DTO.admin;

namespace DoAnTotNghiep.Controllers.admin
{
    [ApiController]
    [Route("admin/[controller]")]

    public class JobPostsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;
        public JobPostsController(IMapper mapper, AppDbContext context)
        {
            _mapper = mapper;
            _context = context;
        }
        [HttpPost("jobpost")]
        public async Task<ActionResult<CreateJobPostsDTO>> JobPosts([FromForm] CreateJobPostsDTO model){
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var employer = await _context.Employers.FirstOrDefaultAsync(e => e.EmployerId == model.EmployerId);
                if (employer == null) return NotFound("Nhà tuyển dụng không tồn tại!");

                if (!model.CategoryId.HasValue)
                    return BadRequest("Vui lòng chọn loại ngành nghề.");

                var category = await _context.JobCategories.FirstOrDefaultAsync(c => c.CategoryId == model.CategoryId);
                if (category == null) return NotFound("Loại nghành nghề không tồn tại!");

                Transaction? transaction = null;
                DateTime now = DateTime.Now;
                if (model.IsFeatured)
                {
                    transaction = await _context.Transactions
                      .Include(t => t.ServicePackage)
                      .FirstOrDefaultAsync(t =>
                           t.UserId == employer.UserId &&
                           t.Status == "completed" &&
                           t.ServicePackage != null &&
                           t.CreatedAt.HasValue &&
                           t.CreatedAt.Value.AddDays(t.ServicePackage.DurationDays ?? 0) >= now
                      );

                    if (transaction == null) return BadRequest("Bạn chưa có gói dịch vụ nào còn hiệu lực");

                }

                string? imageUrl = null;
                if (model.ImageFile != null && model.ImageFile.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.ImageFile.FileName);
                    var uploadPath = Path.Combine("wwwroot", "uploads", "jobs", "imgs");
                    Directory.CreateDirectory(uploadPath);
                    var filePath = Path.Combine(uploadPath, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.ImageFile.CopyToAsync(stream);
                    }
                    imageUrl = $"/uploads/jobs/imgs/{fileName}";
                }

                var jobPost = _mapper.Map<JobPost>(model);
                jobPost.Images = imageUrl;

                _context.JobPosts.Add(jobPost);
                await _context.SaveChangesAsync();

                if(transaction != null)
                {
                    var durationDays = transaction.ServicePackage?.DurationDays ?? 0;
                    var feature = new JobPostFeature
                    {
                        JobId = jobPost.JobId,
                        FeatureType = "Pro",
                        StartDate = now,
                        EndDate = now.AddDays(durationDays),
                        Priority = 1
                    };
                    _context.JobPostFeatures.Add(feature);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Tạo bài đăng thành công!", id = jobPost.JobId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {Message = "Lỗi server", error = ex.Message});
            }
        }
    }
}
