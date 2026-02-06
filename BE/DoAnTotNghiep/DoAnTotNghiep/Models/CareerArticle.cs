using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("career_articles", Schema = "tuyendung")]
[Index("ArticleId", Name = "career_articles$article_id", IsUnique = true)]
[Index("Slug", Name = "career_articles$slug", IsUnique = true)]
public partial class CareerArticle
{
    [Key]
    [Column("article_id")]
    public int ArticleId { get; set; }

    [Column("title")]
    [StringLength(255)]
    public string? Title { get; set; }

    [Column("slug")]
    [StringLength(255)]
    public string? Slug { get; set; }

    [Column("content")]
    public string? Content { get; set; }

    [Column("author_id")]
    public int? AuthorId { get; set; }

    [Column("created_at")]
    [Precision(0)]
    public DateTime? CreatedAt { get; set; }

    [Column("updated_at")]
    [Precision(0)]
    public DateTime? UpdatedAt { get; set; }
}
