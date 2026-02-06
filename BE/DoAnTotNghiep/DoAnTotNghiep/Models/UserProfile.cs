using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("user_profiles", Schema = "tuyendung")]
[Index("UserId", Name = "user_profiles$user_id", IsUnique = true)]
public partial class UserProfile
{
    [Key]
    [Column("profile_id")]
    public int ProfileId { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("full_name")]
    [StringLength(255)]
    public string? FullName { get; set; }

    [Column("phone")]
    [StringLength(20)]
    public string? Phone { get; set; }

    [Column("address")]
    public string? Address { get; set; }

    [Column("bio")]
    public string? Bio { get; set; }

    [Column("created_at", TypeName = "datetime")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at", TypeName = "datetime")]
    public DateTime UpdatedAt { get; set; }
}
