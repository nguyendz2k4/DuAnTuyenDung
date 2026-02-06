using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("article_categories", Schema = "tuyendung")]
[Index("CategoryId", Name = "article_categories$category_id", IsUnique = true)]
public partial class ArticleCategory
{
    [Key]
    [Column("category_id")]
    public int CategoryId { get; set; }

    [Column("name")]
    [StringLength(100)]
    public string? Name { get; set; }

    [Column("description")]
    public string? Description { get; set; }
}
