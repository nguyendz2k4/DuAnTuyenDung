using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[PrimaryKey("JobId", "CategoryId")]
[Table("job_post_categories", Schema = "tuyendung")]
[Index("CategoryId", Name = "category_id")]
public partial class JobPostCategory
{
    [Key]
    [Column("job_id")]
    public int JobId { get; set; }

    [Key]
    [Column("category_id")]
    public int CategoryId { get; set; }
}
