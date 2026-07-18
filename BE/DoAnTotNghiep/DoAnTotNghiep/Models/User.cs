using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("users", Schema = "tuyendung")]
public class User
{
    [Key]
    [Column("user_id")]
    public int UserId { get; set; }

    [Column("full_name")]
    public string? FullName { get; set; }

    [Column("avatar")]
    public string? Avatar { get; set; }

    [Column("google_id")]
    public string? GoogleId { get; set; }

    [Column("facebook_id")]
    public string? FacebookId { get; set; }

    [Column("is_verified")]
    public short? IsVerified { get; set; }

    [Column("status")]
    public short? Status { get; set; }

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    [Column("last_login")]
    public DateTime? LastLogin { get; set; }

    [Column("IdentityUserId")]
    public string? IdentityUserId { get; set; } 
}
