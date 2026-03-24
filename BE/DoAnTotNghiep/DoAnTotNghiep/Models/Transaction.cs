using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("transactions", Schema = "tuyendung")]
[Index("TransactionId", Name = "transactions$transaction_id", IsUnique = true)]
public partial class Transaction
{
    [Key]
    [Column("transaction_id")]
    public int TransactionId { get; set; }

    [Column("user_id")]
    public int? UserId { get; set; }

    [Column("package_id")]
    public int? PackageId { get; set; }

    [Column("amount", TypeName = "decimal(10, 2)")]
    public decimal? Amount { get; set; }

    [Column("status")]
    [StringLength(255)]
    public string? Status { get; set; }

    [Column("created_at")]
    [Precision(0)]
    public DateTime? CreatedAt { get; set; }
    [ForeignKey("PackageId")]
    public virtual ServicePackage? ServicePackage { get; set; }
}
