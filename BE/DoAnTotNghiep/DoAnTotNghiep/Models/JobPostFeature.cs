using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("job_post_features", Schema = "tuyendung")]
[Index("JobId", Name = "job_id")]
public partial class JobPostFeature
{
    [Key]
    [Column("job_post_feature_id")]
    public int JobPostFeatureId { get; set; }

    [Column("job_id")]
    public int JobId { get; set; }

    [Column("feature_type")]
    [StringLength(9)]
    public string FeatureType { get; set; } = null!;

    [Column("start_date")]
    [Precision(0)]
    public DateTime StartDate { get; set; }

    [Column("end_date")]
    [Precision(0)]
    public DateTime EndDate { get; set; }

    [Column("priority")]
    public int? Priority { get; set; }
}
