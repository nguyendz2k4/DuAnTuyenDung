using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("article_tags", Schema = "tuyendung")]
[Index("Name", Name = "article_tags$name", IsUnique = true)]
[Index("TagId", Name = "article_tags$tag_id", IsUnique = true)]
public partial class ArticleTag
{
    [Key]
    [Column("tag_id")]
    public int TagId { get; set; }

    [Column("name")]
    [StringLength(50)]
    public string? Name { get; set; }
}
