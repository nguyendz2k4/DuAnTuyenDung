using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("cv_uploads", Schema = "tuyendung")]
[Index("CvId", Name = "cv_uploads$cv_id", IsUnique = true)]
[Index("SeekerId", Name = "seeker_id")]
public partial class CvUpload
{
    [Key]
    [Column("cv_id")]
    public int CvId { get; set; }

    [Column("seeker_id")]
    public int? SeekerId { get; set; }

    [Column("file_path")]
    [StringLength(255)]
    public string? FilePath { get; set; }

    [Column("file_type")]
    [StringLength(255)]
    public string? FileType { get; set; }

    [Column("uploaded_at")]
    [Precision(0)]
    public DateTime? UploadedAt { get; set; }
}
