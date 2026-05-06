

namespace DoAnTotNghiep.DTO.admin
{
    public class AccountsDTO
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? AccountType { get; set; } 
        public string? Avatar { get; set; }
        public required string Password { get; set; }

        public string? CompanyName { get; set; }
        public string? CompanyWebsite { get; set; }
        public string? AddressCompany { get; set; }
        public string? Logo { get; set; }
        public string? CompanyPhone { get; set; }



        public List<string> AllowedPermissions { get; set; } = new();
    }
}
