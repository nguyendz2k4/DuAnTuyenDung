namespace DoAnTotNghiep.DTO.users
{
    public class JobListDto
    {
        public int JobId { get; set; }
        public int EmployerId { get; set; }
        public string? Title { get; set; }
        public string? SalaryRange { get; set; }
        public string? Location { get; set; }

        public string? CompanyName { get; set; }
        public string? CompanyLogo { get; set; }

        public bool IsPro { get; set; }
    }
}