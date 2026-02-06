using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("resumes", Schema = "tuyendung")]
[Index("ResumeId", Name = "resumes$resume_id", IsUnique = true)]
[Index("SeekerId", Name = "seeker_id")]
public partial class Resume
{
    [Key]
    [Column("resume_id")]
    public int ResumeId { get; set; }

    [Column("seeker_id")]
    public int? SeekerId { get; set; }

    [Column("title")]
    [StringLength(255)]
    public string? Title { get; set; }

    [Column("summary")]
    public string? Summary { get; set; }

    [Column("experience")]
    public string? Experience { get; set; }

    [Column("education")]
    public string? Education { get; set; }

    [Column("skills")]
    public string? Skills { get; set; }

    [Column("created_at")]
    [Precision(0)]
    public DateTime? CreatedAt { get; set; }

    [Column("updated_at")]
    [Precision(0)]
    public DateTime? UpdatedAt { get; set; }
}
