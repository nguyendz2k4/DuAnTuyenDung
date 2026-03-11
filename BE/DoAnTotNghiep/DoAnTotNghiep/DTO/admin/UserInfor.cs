using System.ComponentModel.DataAnnotations.Schema;

namespace DoAnTotNghiep.DTO.admin
{
    public class UserInfor
    {
        //Chung
        public string? FullName { get; set; }
        public string? Avatar { get; set; }
        public string? AccountType { get; set; }
        public short? Status { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }


        //nhà tuyển dụng
        public string? CompanyName { get; set; }
        public string? CompanyWebsite { get; set; }
        public string? CompanySize { get; set; }
        public string? NameIndustry { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyPhone { get; set; }
        public string? Logo { get; set; }

        public string? Description { get; set; }


    }
}
