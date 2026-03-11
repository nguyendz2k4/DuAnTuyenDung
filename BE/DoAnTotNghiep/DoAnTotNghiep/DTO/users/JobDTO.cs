namespace DoAnTotNghiep.DTO.users
{
    public class JobDto
    {
        public int JobId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? SalaryRange { get; set; }
        public string? Location { get; set; }
        public string? JobType { get; set; }
        public int ViewCount { get; set; }
        public int EmployerId { get; set; }
        public int? IndustryId { get; set; }
        public string? CategoryName { get; set; }
        public string? CompanyName {  get; set; }
        public string? CompanySize { get; set; }
        public string? Address { get; set; }
        public string? Level { get; set; }
        public string? Education { get; set; }
        public int? Quantity { get; set; }
        public string? Images { get; set; }
        public string? Requirements { get; set; }
        public string? Logo { get; set; }
        public string? NameIndustry { get; set; }
        public string? CompanyWebsite { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
