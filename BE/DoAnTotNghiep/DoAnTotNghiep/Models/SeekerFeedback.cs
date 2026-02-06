using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("seeker_feedback", Schema = "tuyendung")]
[Index("EmployerId", Name = "employer_id")]
[Index("FeedbackId", Name = "seeker_feedback$feedback_id", IsUnique = true)]
[Index("SeekerId", Name = "seeker_id")]
public partial class SeekerFeedback
{
    [Key]
    [Column("feedback_id")]
    public int FeedbackId { get; set; }

    [Column("employer_id")]
    public int? EmployerId { get; set; }

    [Column("seeker_id")]
    public int? SeekerId { get; set; }

    [Column("rating")]
    public short? Rating { get; set; }

    [Column("comment")]
    [StringLength(300)]
    public string? Comment { get; set; }

    [Column("created_at")]
    [Precision(0)]
    public DateTime? CreatedAt { get; set; }
}
