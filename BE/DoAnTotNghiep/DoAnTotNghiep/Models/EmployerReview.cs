using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("employer_reviews", Schema = "tuyendung")]
[Index("EmployerId", Name = "employer_id")]
[Index("ReviewId", Name = "employer_reviews$review_id", IsUnique = true)]
[Index("SeekerId", Name = "seeker_id")]
public partial class EmployerReview
{
    [Key]
    [Column("review_id")]
    public int ReviewId { get; set; }

    [Column("seeker_id")]
    public int? SeekerId { get; set; }

    [Column("employer_id")]
    public int? EmployerId { get; set; }

    [Column("rating")]
    public short? Rating { get; set; }

    [Column("comment")]
    [StringLength(300)]
    public string? Comment { get; set; }

    [Column("created_at")]
    [Precision(0)]
    public DateTime? CreatedAt { get; set; }
}
