using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

[Table("messages", Schema = "tuyendung")]
[Index("MessageId", Name = "messages$message_id", IsUnique = true)]
[Index("ReceiverId", Name = "receiver_id")]
[Index("SenderId", Name = "sender_id")]
public partial class Message
{
    [Key]
    [Column("message_id")]
    public int MessageId { get; set; }

    [Column("sender_id")]
    public int? SenderId { get; set; }

    [Column("receiver_id")]
    public int? ReceiverId { get; set; }

    [Column("content")]
    public string? Content { get; set; }

    [Column("is_read")]
    public short? IsRead { get; set; }

    [Column("created_at")]
    [Precision(0)]
    public DateTime? CreatedAt { get; set; }
}
