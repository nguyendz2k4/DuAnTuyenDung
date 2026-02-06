using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[PrimaryKey("ArticleId", "CategoryId")]
[Table("article_category_map", Schema = "tuyendung")]
public partial class ArticleCategoryMap
{
    [Key]
    [Column("article_id")]
    public int ArticleId { get; set; }

    [Key]
    [Column("category_id")]
    public int CategoryId { get; set; }
}
