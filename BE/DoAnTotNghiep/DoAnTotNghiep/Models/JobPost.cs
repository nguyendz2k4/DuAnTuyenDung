using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("job_posts", Schema = "tuyendung")]
[Index("CategoryId", Name = "category_id")]
[Index("EmployerId", Name = "employer_id")]
[Index("JobId", Name = "job_posts$job_id", IsUnique = true)]
public partial class JobPost
{
    [Key]
    [Column("job_id")]
    public int JobId { get; set; }

    [Column("employer_id")]
    public int? EmployerId { get; set; }

    [Column("category_id")]
    public int? CategoryId { get; set; }

    [Column("title")]
    [StringLength(255)]
    public string? Title { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("requirements")]
    public string? Requirements { get; set; }

    [Column("salary_range")]
    [StringLength(255)]
    public string? SalaryRange { get; set; }

    [Column("job_type")]
    [StringLength(255)]
    public string? JobType { get; set; }

    [Column("location")]
    [StringLength(255)]
    public string? Location { get; set; }

    [Column("status")]
    [StringLength(50)]
    public string? Status { get; set; }

    [Column("created_at")]
    [Precision(0)]
    public DateTime? CreatedAt { get; set; }

    [Column("updated_at")]
    [Precision(0)]
    public DateTime? UpdatedAt { get; set; }

    [Column("level")]
    [StringLength(100)]
    public string? Level { get; set; }

    [Column("education")]
    [StringLength(100)]
    public string? Education { get; set; }

    [Column("quantity")]
    public int? Quantity { get; set; }

    [Column("work_form")]
    [StringLength(100)]
    public string? WorkForm { get; set; }

    [Column("images")]
    public string? Images { get; set; }

    [Column("view_count")]
    public int? ViewCount { get; set; }

    [Column("deadline", TypeName = "datetime")] 
    public DateTime? Deadline { get; set; }

    [Column("is_approved")]
    public short? IsApproved { get; set; }

    public JobCategory? Category { get; set; }
    public Employer? Employer { get; set; }
}
