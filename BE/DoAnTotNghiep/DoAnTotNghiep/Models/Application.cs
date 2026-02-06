using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("applications", Schema = "tuyendung")]
[Index("ApplicationId", Name = "applications$application_id", IsUnique = true)]
[Index("CvId", Name = "cv_id")]
[Index("JobId", Name = "job_id")]
[Index("ResumeId", Name = "resume_id")]
[Index("SeekerId", Name = "seeker_id")]
public partial class Application
{
    [Key]
    [Column("application_id")]
    public int ApplicationId { get; set; }

    [Column("job_id")]
    public int? JobId { get; set; }

    [Column("seeker_id")]
    public int? SeekerId { get; set; }

    [Column("full_name")]
    [StringLength(100)]
    public string? FullName { get; set; }

    [Column("email")]
    [StringLength(100)]
    public string? Email { get; set; }

    [Column("phone")]
    [StringLength(20)]
    public string? Phone { get; set; }

    [Column("location")]
    [StringLength(255)]
    public string? Location { get; set; }

    [Column("resume_id")]
    public int? ResumeId { get; set; }

    [Column("cv_id")]
    public int? CvId { get; set; }

    [Column("cover_letter")]
    public string? CoverLetter { get; set; }

    [Column("status")]
    [StringLength(255)]
    public string? Status { get; set; }

    [Column("applied_at")]
    [Precision(0)]
    public DateTime? AppliedAt { get; set; }
}
