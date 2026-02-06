using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("users", Schema = "tuyendung")]
[Index("FacebookId", Name = "idx_facebook_id")]
[Index("GoogleId", Name = "idx_google_id")]
[Index("Email", Name = "users$email", IsUnique = true)]
[Index("FacebookId", Name = "users$facebook_id", IsUnique = true)]
[Index("GoogleId", Name = "users$google_id", IsUnique = true)]
[Index("UserId", Name = "users$user_id", IsUnique = true)]
public partial class User
{
    [Key]
    [Column("user_id")]
    public int UserId { get; set; }

    [Column("username")]
    [StringLength(30)]
    public string? Username { get; set; }

    [Column("email")]
    [StringLength(50)]
    public string? Email { get; set; }

    [Column("full_name")]
    [StringLength(100)]
    public string? FullName { get; set; }

    [Column("avatar")]
    [StringLength(500)]
    public string? Avatar { get; set; }

    [Column("phone")]
    [StringLength(20)]
    public string? Phone { get; set; }

    [Column("account_type")]
    [StringLength(8)]
    public string? AccountType { get; set; }

    [Column("google_id")]
    [StringLength(255)]
    public string? GoogleId { get; set; }

    [Column("facebook_id")]
    [StringLength(255)]
    public string? FacebookId { get; set; }

    [Column("is_verified")]
    public short? IsVerified { get; set; }

    [Column("password_hash")]
    [StringLength(255)]
    public string? PasswordHash { get; set; }

    [Column("role")]
    [StringLength(10)]
    public string? Role { get; set; }

    [Column("status")]
    public short? Status { get; set; }

    [Column("created_at")]
    [Precision(0)]
    public DateTime? CreatedAt { get; set; }

    [Column("updated_at")]
    [Precision(0)]
    public DateTime? UpdatedAt { get; set; }

    [Column("last_login", TypeName = "datetime")]
    public DateTime? LastLogin { get; set; }
}
