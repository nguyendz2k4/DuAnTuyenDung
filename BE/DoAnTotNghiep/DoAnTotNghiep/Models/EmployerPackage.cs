using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("employer_packages", Schema = "tuyendung")]
[Index("EmployerId", Name = "employer_id")]
[Index("PackageId", Name = "package_id")]
public partial class EmployerPackage
{
    [Key]
    [Column("employer_package_id")]
    public int EmployerPackageId { get; set; }

    [Column("employer_id")]
    public int EmployerId { get; set; }

    [Column("package_id")]
    public int PackageId { get; set; }

    [Column("start_date")]
    [Precision(0)]
    public DateTime StartDate { get; set; }

    [Column("end_date")]
    [Precision(0)]
    public DateTime EndDate { get; set; }

    [Column("status")]
    [StringLength(9)]
    public string? Status { get; set; }

    [Column("created_at")]
    [Precision(0)]
    public DateTime? CreatedAt { get; set; }
}
