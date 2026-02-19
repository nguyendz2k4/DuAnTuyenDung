using System.ComponentModel.DataAnnotations;

namespace DoAnTotNghiep.DTO
{
    public class LoginRequestDTO
    {
        [Required(ErrorMessage = "Vui lòng nhập Email hoặc Tên đăng nhập")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
        public string Password { get; set; }

        public bool RememberMe { get; set; } = false;
    }
}