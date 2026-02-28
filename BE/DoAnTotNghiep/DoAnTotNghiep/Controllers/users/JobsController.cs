using DoAnTotNghiep.DTO;
using DoAnTotNghiep.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Controllers.users
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<JobListDto>>> GetJob(
            int page = 1,
            int limit = 12,
            string? location = null,
            string? search = null,
            string? salary = null,
            string? experience = null,
            string? education = null,
            int? category_id = null
        )
        {
            if (page < 1) page = 1;
            if (limit < 1) limit = 12;
            var now = DateTime.Now;

            // --- BƯỚC 1: QUERY ---
            var query =
                from jp in _context.JobPosts
                join e in _context.Employers on jp.EmployerId equals e.EmployerId into emp
                from e in emp.DefaultIfEmpty()
                join jpf in _context.JobPostFeatures.Where(x => x.FeatureType == "pro" && x.EndDate > now)
                    on jp.JobId equals jpf.JobId into feat
                from jpf in feat.DefaultIfEmpty()
                where jp.Status == "active" && jp.IsApproved == 1
                select new { jp, e, jpf };

            // --- BƯỚC 2: FILTER ---

            // 1. Lọc địa điểm
            if (!string.IsNullOrWhiteSpace(location) && location != "Ngẫu nhiên")
            {
                var loc = location.Trim();

                if (loc == "Miền Bắc")
                {
                    query = query.Where(x => x.jp.Location != null && (
                        x.jp.Location.Contains("Hà Nội") ||
                        x.jp.Location.Contains("Hải Phòng") ||
                        x.jp.Location.Contains("Bắc Ninh") ||
                        x.jp.Location.Contains("Hưng Yên") ||
                        x.jp.Location.Contains("Hải Dương") ||
                        x.jp.Location.Contains("Nghệ An") ||
                        x.jp.Location.Contains("Hà Tĩnh") ||
                        x.jp.Location.Contains("Thanh Hoá") ||
                        x.jp.Location.Contains("Đà Nẵng") ||
                        x.jp.Location.Contains("Vĩnh Phúc")
                    ));
                }
                else if (loc == "Miền Nam")
                {
                    query = query.Where(x => x.jp.Location != null && (
                        x.jp.Location.Contains("Hồ Chí Minh") ||
                        x.jp.Location.Contains("Bình Dương") ||
                        x.jp.Location.Contains("Đồng Nai") ||
                        x.jp.Location.Contains("Cần Thơ") ||
                        x.jp.Location.Contains("Long An") ||
                        x.jp.Location.Contains("Vũng Tàu")
                    ));
                }
                else
                {
                    query = query.Where(x => x.jp.Location != null && x.jp.Location.Contains(loc));
                }
            }

            // 2. Tìm kiếm
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(x =>
                    (x.jp.Title != null && x.jp.Title.Contains(search)) ||
                    (x.jp.Description != null && x.jp.Description.Contains(search)) ||
                    (x.e != null && x.e.CompanyName != null && x.e.CompanyName.Contains(search))
                );
            }

            // 3. Lọc lương
            if (!string.IsNullOrWhiteSpace(salary) && salary != "Tất cả")
            {
                query = query.Where(x => x.jp.SalaryRange != null && x.jp.SalaryRange.Contains(salary));
            }

            // 4. Lọc kinh nghiệm
            if (!string.IsNullOrWhiteSpace(experience) && experience != "Tất cả")
            {
                switch (experience)
                {
                    case "Chưa có kinh nghiệm":
                        query = query.Where(x => x.jp.Level != null && (
                            x.jp.Level.Contains("Chưa có kinh nghiệm") ||
                            x.jp.Level.Contains("Fresher") ||
                            x.jp.Level.Contains("Intern")));
                        break;
                    case "1 năm trở xuống":
                        query = query.Where(x => x.jp.Level != null && (
                             x.jp.Level.Contains("1 năm") ||
                             x.jp.Level.Contains("Junior")));
                        break;
                    case "1 năm trở lên":
                        query = query.Where(x => x.jp.Level != null && (
                             x.jp.Level.Contains("Senior") ||
                             x.jp.Level.Contains("Lead") ||
                             x.jp.Level.Contains("Manager")));
                        break;
                }
            }

            // 5. Lọc học vấn
            if (!string.IsNullOrWhiteSpace(education) && education != "Tất cả")
            {
                query = query.Where(x => x.jp.Education != null && x.jp.Education.Contains(education));
            }

            // 6. Lọc danh mục
            if (category_id.HasValue && category_id.Value > 0)
            {
                query = query.Where(x => x.jp.CategoryId == category_id.Value);
            }

            // --- BƯỚC 3 & 4: PHÂN TRANG & SELECT ---

            // Tính tổng số lượng bản ghi trước khi phân trang
            var totalJobs = await query.CountAsync();

            // Query lấy dữ liệu trang hiện tại
            var jobs = await query
                .OrderByDescending(x => x.jpf != null) // Ưu tiên tin Pro
                .ThenByDescending(x => x.jpf != null ? x.jpf.Priority : 0)
                .ThenByDescending(x => x.jp.CreatedAt) // Mới nhất lên đầu
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(x => new JobListDto
                {
                    JobId = x.jp.JobId,
                    EmployerId = x.jp.EmployerId ?? 0, 
                    Title = x.jp.Title,
                    SalaryRange = x.jp.SalaryRange,
                    Location = x.jp.Location,

                    // Kiểm tra null cho Employer
                    CompanyName = x.e != null ? x.e.CompanyName : "Đang cập nhật",
                    CompanyLogo = x.e != null ? x.e.Logo : null,

                    IsPro = x.jpf != null
                })
                .ToListAsync();

            // ✅ THAY ĐỔI: Sử dụng PagedResult để đóng gói dữ liệu
            var result = new PagedResult<JobListDto>(jobs, page, limit, totalJobs);

            return Ok(result);
        }
    }
}