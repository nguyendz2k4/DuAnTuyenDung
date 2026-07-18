using System.ComponentModel.DataAnnotations;

namespace DoAnTotNghiep.DTO.users
{
    public class RegisterRequestDTO
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Tên đăng nhập là bắt buộc")]
        public required string UserName { get; set; }

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        public required string Password { get; set; }

        [Required(ErrorMessage = "Họ tên là bắt buộc")]
        public required string FullName { get; set; }

    }
    public class RegisterResponseDTO
    {
        public string Message { get; set; } = string.Empty;
        public int UserId { get; set; }
    }
}