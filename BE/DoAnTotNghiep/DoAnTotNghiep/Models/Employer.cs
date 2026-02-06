using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("employers", Schema = "tuyendung")]
[Index("EmployerId", Name = "employers$employer_id", IsUnique = true)]
[Index("UserId", Name = "employers$user_id", IsUnique = true)]
[Index("IndustryId", Name = "industry_id")]
public partial class Employer
{
    [Key]
    [Column("employer_id")]
    public int EmployerId { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("company_name")]
    [StringLength(100)]
    public string? CompanyName { get; set; }

    [Column("company_website")]
    [StringLength(255)]
    public string? CompanyWebsite { get; set; }

    [Column("company_size")]
    [StringLength(50)]
    public string? CompanySize { get; set; }

    [Column("industry_id")]
    public int? IndustryId { get; set; }

    [Column("phone")]
    [StringLength(15)]
    public string? Phone { get; set; }

    [Column("address")]
    [StringLength(255)]
    public string? Address { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("logo")]
    [StringLength(255)]
    public string? Logo { get; set; }
    public virtual ICollection<JobPost> JobPosts { get; set; } = new List<JobPost>();
    [ForeignKey("IndustryId")]
    public virtual Industry? Industry { get; set; }

}
