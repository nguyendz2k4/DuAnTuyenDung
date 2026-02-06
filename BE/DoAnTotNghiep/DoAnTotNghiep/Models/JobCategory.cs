using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("job_categories", Schema = "tuyendung")]
[Index("CategoryId", Name = "job_categories$category_id", IsUnique = true)]
public partial class JobCategory
{
    [Key]
    [Column("category_id")]
    public int CategoryId { get; set; }

    [Column("name")]
    [StringLength(100)]
    public string? Name { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    public ICollection<JobPost>? JobPosts { get; set; }
}
