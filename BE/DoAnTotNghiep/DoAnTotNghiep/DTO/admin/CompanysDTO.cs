namespace DoAnTotNghiep.DTO.admin
{
    public class CreateEmployerDto
    {
        public int UserId { get; set; } 
    }

    public class UpdateEmployerProfileDto  
    {
        public string? CompanyName { get; set; }
        public string? CompanyWebsite { get; set; }
        public string? CompanySize { get; set; }
        public string? Description { get; set; }
    }
}
