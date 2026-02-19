using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoAnTotNghiep.Migrations
{
    /// <inheritdoc />
    public partial class RefactorIdentitySeparation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "tuyendung");

            // =========================================================================
            // QUAN TRỌNG: TOÀN BỘ CODE Ở ĐÂY ĐƯỢC COMMENT LẠI
            // LÝ DO: Database thực tế đã có đầy đủ bảng Identity và cột IdentityUserId.
            // MỤC ĐÍCH: Chạy migration rỗng để EF Core ghi nhận trạng thái thành công.
            // =========================================================================

            /*
            // 1. Comment phần tạo bảng Identity
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });
            
             migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                 // ... (các phần khác đã ẩn)
             );
             migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                 // ...
             );
             migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                 // ...
             );
             migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                 // ...
             );
             migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                 // ...
             );
             */

            // 2. Comment phần thêm cột IdentityUserId (VÌ DB ĐÃ CÓ RỒI)
            /*
            migrationBuilder.AddColumn<string>(
                name: "IdentityUserId",
                schema: "tuyendung",
                table: "users",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_IdentityUserId",
                schema: "tuyendung",
                table: "users",
                column: "IdentityUserId");
            */
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Giữ nguyên hoặc comment nốt cũng được, nhưng để thế này không sao
            migrationBuilder.DropColumn(
                name: "IdentityUserId",
                schema: "tuyendung",
                table: "users");
        }
    }
}