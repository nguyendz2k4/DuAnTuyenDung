using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("job_seekers", Schema = "tuyendung")]
[Index("SeekerId", Name = "job_seekers$seeker_id", IsUnique = true)]
[Index("UserId", Name = "job_seekers$user_id", IsUnique = true)]
public partial class JobSeeker
{
    [Key]
    [Column("seeker_id")]
    public int SeekerId { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("full_name")]
    [StringLength(30)]
    public string? FullName { get; set; }

    [Column("date_of_birth")]
    public DateOnly? DateOfBirth { get; set; }

    [Column("gender")]
    [StringLength(10)]
    public string? Gender { get; set; }

    [Column("phone")]
    [StringLength(15)]
    public string? Phone { get; set; }

    [Column("address")]
    [StringLength(255)]
    public string? Address { get; set; }

    [Column("skills")]
    public string? Skills { get; set; }

    [Column("education_level")]
    [StringLength(100)]
    public string? EducationLevel { get; set; }

    [Column("experience_years")]
    public int? ExperienceYears { get; set; }
}
