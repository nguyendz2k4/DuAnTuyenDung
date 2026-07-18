using System.ComponentModel.DataAnnotations.Schema;

namespace DoAnTotNghiep.DTO.admin
{
    public class UserInfor
    {
        //Chung
        public string? FullName { get; set; }
        public string? Avatar { get; set; }
        public short? Status { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
}
