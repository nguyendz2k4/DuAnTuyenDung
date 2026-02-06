using DoAnTotNghiep.DTO;
using DoAnTotNghiep.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Controllers.users
{
    [ApiController]
    [Route("api/[controller]")]
    public class DetailJobs : Controller
    {
        private readonly AppDbContext _context;
        public DetailJobs(AppDbContext context)
        {
            _context = context;
        }

        // --- Hàm Detail cũ của bạn (Giữ nguyên) ---
        [HttpGet("{id}")]
        public async Task<ActionResult<JobDto>> Detail(int id)
        {
            // ... (Code cũ của bạn ở đây) ...
            var jobDetail = await _context.JobPosts
                .Where(j => j.JobId == id)
                .Select(j => new JobDto
                {
                    JobId = j.JobId,
                    Title = j.Title,
                    Description = j.Description,
                    SalaryRange = j.SalaryRange,
                    Location = j.Location,
                    JobType = j.JobType,
                    ViewCount = j.ViewCount ?? 0,
                    Quantity = j.Quantity,
                    Level = j.Level,
                    Education = j.Education,
                    Requirements = j.Requirements,
                    CreatedAt = j.CreatedAt ?? DateTime.Now,
                    EmployerId = j.EmployerId ?? 0,
                    IndustryId = j.Employer != null ? j.Employer.IndustryId : null,
                    CompanyName = j.Employer != null ? j.Employer.CompanyName : null,
                    CompanySize = j.Employer != null ? j.Employer.CompanySize : null,
                    Address = j.Employer != null ? j.Employer.Address : null,
                    Images = j.Employer != null ? j.Employer.Logo : null,
                    CategoryName = j.Category != null ? j.Category.Name : null,
                    NameIndustry = (j.Employer != null && j.Employer.Industry != null)
                   ? j.Employer.Industry.NameIndustry
                   : null
                })
                .FirstOrDefaultAsync();

            if (jobDetail == null)
            {
                return NotFound(new { message = "Không tìm thấy bài tuyển dụng này" });
            }

            return Ok(jobDetail);
        }

        // ---------------------------------------------------------
        // 👇👇👇 THÊM HÀM TEST VÀO ĐÂY (TRONG CLASS, DƯỚI HÀM DETAIL) 👇👇👇
        // ---------------------------------------------------------
        [HttpGet("test-connection")]
        public IActionResult TestConnection()
        {
            try
            {
                // 1. Mở kết nối thử
                _context.Database.OpenConnection();
                var serverName = _context.Database.GetDbConnection().DataSource;
                var dbName = _context.Database.GetDbConnection().Database;
                _context.Database.CloseConnection();

                // 2. Đếm số bài viết
                var count = _context.JobPosts.Count();

                // 3. Lấy thử bài đầu tiên để xem dữ liệu
                var firstJob = _context.JobPosts.FirstOrDefault();

                return Ok(new
                {
                    Status = "✅ Kết nối thành công!",
                    Server = serverName,     // Quan trọng: Xem nó có đúng là máy bạn ko
                    Database = dbName,       // Quan trọng: Xem đúng tên DB ko
                    TotalJobs = count,       // Quan trọng: Nếu bằng 0 là DB rỗng hoặc nhầm bảng
                    FirstJobId = firstJob?.JobId,
                    Note = "Nếu TotalJobs = 0 nghĩa là đang kết nối nhầm DB hoặc bảng chưa có dữ liệu."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Status = "❌ Lỗi kết nối!",
                    Error = ex.Message,
                    Detail = ex.InnerException?.Message
                });
            }
        }
        // ---------------------------------------------------------

    }
}