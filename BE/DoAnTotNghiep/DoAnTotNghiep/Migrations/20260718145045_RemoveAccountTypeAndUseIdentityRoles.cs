using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoAnTotNghiep.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAccountTypeAndUseIdentityRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                IF NOT EXISTS (SELECT 1 FROM [AspNetRoles] WHERE [NormalizedName] = N'ADMIN')
                    INSERT INTO [AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp])
                    VALUES (CONVERT(nvarchar(450), NEWID()), N'Admin', N'ADMIN', CONVERT(nvarchar(36), NEWID()));

                IF NOT EXISTS (SELECT 1 FROM [AspNetRoles] WHERE [NormalizedName] = N'EMPLOYER')
                    INSERT INTO [AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp])
                    VALUES (CONVERT(nvarchar(450), NEWID()), N'Employer', N'EMPLOYER', CONVERT(nvarchar(36), NEWID()));

                IF NOT EXISTS (SELECT 1 FROM [AspNetRoles] WHERE [NormalizedName] = N'JOBSEEKER')
                    INSERT INTO [AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp])
                    VALUES (CONVERT(nvarchar(450), NEWID()), N'JobSeeker', N'JOBSEEKER', CONVERT(nvarchar(36), NEWID()));

                INSERT INTO [AspNetUserRoles] ([UserId], [RoleId])
                SELECT [domainUser].[IdentityUserId], [role].[Id]
                FROM [tuyendung].[users] AS [domainUser]
                INNER JOIN [AspNetUsers] AS [identityUser]
                    ON [identityUser].[Id] = [domainUser].[IdentityUserId]
                INNER JOIN [AspNetRoles] AS [role]
                    ON [role].[NormalizedName] = CASE UPPER(LTRIM(RTRIM(ISNULL([domainUser].[account_type], N''))))
                        WHEN N'ADMIN' THEN N'ADMIN'
                        WHEN N'EMPLOYER' THEN N'EMPLOYER'
                        ELSE N'JOBSEEKER'
                    END
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM [AspNetUserRoles] AS [existingRole]
                    WHERE [existingRole].[UserId] = [domainUser].[IdentityUserId]
                      AND [existingRole].[RoleId] = [role].[Id]);

                DECLARE @defaultConstraint sysname;
                SELECT @defaultConstraint = [defaultConstraint].[name]
                FROM [sys].[default_constraints] AS [defaultConstraint]
                INNER JOIN [sys].[columns] AS [column]
                    ON [column].[object_id] = [defaultConstraint].[parent_object_id]
                   AND [column].[column_id] = [defaultConstraint].[parent_column_id]
                WHERE [defaultConstraint].[parent_object_id] = OBJECT_ID(N'[tuyendung].[users]')
                  AND [column].[name] = N'account_type';

                IF @defaultConstraint IS NOT NULL
                    EXEC(N'ALTER TABLE [tuyendung].[users] DROP CONSTRAINT [' + @defaultConstraint + N']');
                """);

            migrationBuilder.DropColumn(
                name: "account_type",
                schema: "tuyendung",
                table: "users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "account_type",
                schema: "tuyendung",
                table: "users",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                defaultValue: "normal");

            migrationBuilder.Sql("""
                UPDATE [domainUser]
                SET [account_type] = ISNULL([selectedRole].[Name], N'JobSeeker')
                FROM [tuyendung].[users] AS [domainUser]
                OUTER APPLY (
                    SELECT TOP (1) [role].[Name]
                    FROM [AspNetUserRoles] AS [userRole]
                    INNER JOIN [AspNetRoles] AS [role] ON [role].[Id] = [userRole].[RoleId]
                    WHERE [userRole].[UserId] = [domainUser].[IdentityUserId]
                    ORDER BY CASE [role].[NormalizedName]
                        WHEN N'ADMIN' THEN 1
                        WHEN N'EMPLOYER' THEN 2
                        WHEN N'JOBSEEKER' THEN 3
                        ELSE 4
                    END
                ) AS [selectedRole];
                """);
        }
    }
}
