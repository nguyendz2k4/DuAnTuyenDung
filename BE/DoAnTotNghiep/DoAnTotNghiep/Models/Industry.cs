using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("industry", Schema = "tuyendung")]
[Index("IndustryId", Name = "industry$industry_id", IsUnique = true)]
public partial class Industry
{
    [Key]
    [Column("industry_id")]
    public int IndustryId { get; set; }

    [Column("name_industry")]
    [StringLength(255)]
    public string? NameIndustry { get; set; }
}
