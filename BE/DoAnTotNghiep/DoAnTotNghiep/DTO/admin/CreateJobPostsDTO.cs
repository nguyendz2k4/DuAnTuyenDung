using System.ComponentModel.DataAnnotations;
namespace DoAnTotNghiep.DTO.admin
{
    public class CreateJobPostsDTO
    {
        [Required(ErrorMessage ="vui lòng chọn nhà tuyển dụng")]
        public int? EmployerId { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập tiêu đề bài viết")]
        public string? Title { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập yêu cầu công việc")]
        public string? Requirements { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập địa điểm")]
        public string? Location { get; set; }
        public string? Images { get; set; }
        public IFormFile? ImageFile { get; set; }
        public short? IsApproved { get; set; }
        [Required(ErrorMessage = "Vui lòng viết chi tiết bài đăng")]
        public string? Description { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập mức lương")]
        public string? SalaryRange { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập số lượng ứng tuyển")]
        public int? Quantity { get; set; }
        [Required(ErrorMessage = "Vui lòng chọn loại nghành nghề")]
        public int? CategoryId { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn hình thức làm việc")]
        public string? WorkForm { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập trình độ học vấn yêu cầu")]
        public string? Education { get; set; }
        [Required(ErrorMessage = "Vui lòng chọn loại hình công việc (Thực tập, Chính thức...)")]
        public string? JobType { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập ngày hết hạn")]
        public DateTime? Deadline { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập trình độ/kinh nghiệm")]
        public string? Level { get; set; }
        public bool IsFeatured { get; set; }
    }
}
