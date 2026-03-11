using System.ComponentModel.DataAnnotations;

namespace DoAnTotNghiep.DTO.users
{
    public class LoginRequestDTO
    {
        [Required(ErrorMessage = "Vui lòng nhập Email hoặc Tên đăng nhập")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
        public string Password { get; set; }

        public bool RememberMe { get; set; } = false;
    }

    public class LoginResponseDTO
    {
        public string Token { get; set; } = string.Empty;
        public UserInfoDTO User { get; set; } = null!;
    }

    public class UserInfoDTO
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string? Avatar { get; set; }
        public string? Role { get; set; }
    }
}