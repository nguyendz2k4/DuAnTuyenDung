using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("service_packages", Schema = "tuyendung")]
[Index("PackageId", Name = "service_packages$package_id", IsUnique = true)]
public partial class ServicePackage
{
    [Key]
    [Column("package_id")]
    public int PackageId { get; set; }

    [Column("name")]
    [StringLength(30)]
    public string? Name { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("price")]
    public float? Price { get; set; }

    [Column("duration_days")]
    public short? DurationDays { get; set; }

    [Column("features")]
    public string? Features { get; set; }
}
