using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("notifications", Schema = "tuyendung")]
[Index("CreatedAt", Name = "created_at")]
[Index("UserId", "CreatedAt", Name = "idx_user_created")]
[Index("UserId", "IsRead", Name = "idx_user_read")]
[Index("IsRead", Name = "is_read")]
[Index("UserId", Name = "user_id")]
public partial class Notification
{
    [Key]
    [Column("notification_id")]
    public int NotificationId { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("type")]
    [StringLength(18)]
    public string Type { get; set; } = null!;

    [Column("title")]
    [StringLength(255)]
    public string Title { get; set; } = null!;

    [Column("content")]
    public string Content { get; set; } = null!;

    [Column("related_id")]
    public int? RelatedId { get; set; }

    [Column("is_read")]
    public short? IsRead { get; set; }

    [Column("created_at")]
    [Precision(0)]
    public DateTime? CreatedAt { get; set; }
}
