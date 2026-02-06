using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[PrimaryKey("ArticleId", "TagId")]
[Table("article_tag_map", Schema = "tuyendung")]
public partial class ArticleTagMap
{
    [Key]
    [Column("article_id")]
    public int ArticleId { get; set; }

    [Key]
    [Column("tag_id")]
    public int TagId { get; set; }
}
