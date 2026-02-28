using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoAnTotNghiep.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "tuyendung");

            migrationBuilder.CreateTable(
                name: "applications",
                schema: "tuyendung",
                columns: table => new
                {
                    application_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    job_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    seeker_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    full_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true, defaultValueSql: "(NULL)"),
                    email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true, defaultValueSql: "(NULL)"),
                    phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValueSql: "(NULL)"),
                    location = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    resume_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    cv_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    cover_letter = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    status = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    applied_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_applications_application_id", x => x.application_id);
                });

            migrationBuilder.CreateTable(
                name: "article_categories",
                schema: "tuyendung",
                columns: table => new
                {
                    category_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true, defaultValueSql: "(NULL)"),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_article_categories_category_id", x => x.category_id);
                });

            migrationBuilder.CreateTable(
                name: "article_category_map",
                schema: "tuyendung",
                columns: table => new
                {
                    article_id = table.Column<int>(type: "int", nullable: false),
                    category_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_article_category_map_article_id", x => new { x.article_id, x.category_id });
                });

            migrationBuilder.CreateTable(
                name: "article_tag_map",
                schema: "tuyendung",
                columns: table => new
                {
                    article_id = table.Column<int>(type: "int", nullable: false),
                    tag_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_article_tag_map_article_id", x => new { x.article_id, x.tag_id });
                });

            migrationBuilder.CreateTable(
                name: "article_tags",
                schema: "tuyendung",
                columns: table => new
                {
                    tag_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_article_tags_tag_id", x => x.tag_id);
                });

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
                name: "career_articles",
                schema: "tuyendung",
                columns: table => new
                {
                    article_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    slug = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    author_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    created_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(NULL)"),
                    updated_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_career_articles_article_id", x => x.article_id);
                });

            migrationBuilder.CreateTable(
                name: "cv_uploads",
                schema: "tuyendung",
                columns: table => new
                {
                    cv_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    seeker_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    file_path = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    file_type = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    uploaded_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cv_uploads_cv_id", x => x.cv_id);
                });

            migrationBuilder.CreateTable(
                name: "employer_packages",
                schema: "tuyendung",
                columns: table => new
                {
                    employer_package_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    employer_id = table.Column<int>(type: "int", nullable: false),
                    package_id = table.Column<int>(type: "int", nullable: false),
                    start_date = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: false),
                    end_date = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: false),
                    status = table.Column<string>(type: "nvarchar(9)", maxLength: 9, nullable: true, defaultValue: "active"),
                    created_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employer_packages_employer_package_id", x => x.employer_package_id);
                });

            migrationBuilder.CreateTable(
                name: "employer_reviews",
                schema: "tuyendung",
                columns: table => new
                {
                    review_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    seeker_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    employer_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    rating = table.Column<short>(type: "smallint", nullable: true, defaultValueSql: "(NULL)"),
                    comment = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true, defaultValueSql: "(NULL)"),
                    created_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employer_reviews_review_id", x => x.review_id);
                });

            migrationBuilder.CreateTable(
                name: "industry",
                schema: "tuyendung",
                columns: table => new
                {
                    industry_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name_industry = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_industry_industry_id", x => x.industry_id);
                });

            migrationBuilder.CreateTable(
                name: "job_categories",
                schema: "tuyendung",
                columns: table => new
                {
                    category_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true, defaultValueSql: "(NULL)"),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_job_categories_category_id", x => x.category_id);
                });

            migrationBuilder.CreateTable(
                name: "job_post_categories",
                schema: "tuyendung",
                columns: table => new
                {
                    job_id = table.Column<int>(type: "int", nullable: false),
                    category_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_job_post_categories_job_id", x => new { x.job_id, x.category_id });
                });

            migrationBuilder.CreateTable(
                name: "job_post_features",
                schema: "tuyendung",
                columns: table => new
                {
                    job_post_feature_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    job_id = table.Column<int>(type: "int", nullable: false),
                    feature_type = table.Column<string>(type: "nvarchar(9)", maxLength: 9, nullable: false),
                    start_date = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: false),
                    end_date = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: false),
                    priority = table.Column<int>(type: "int", nullable: true, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_job_post_features_job_post_feature_id", x => x.job_post_feature_id);
                });

            migrationBuilder.CreateTable(
                name: "job_seekers",
                schema: "tuyendung",
                columns: table => new
                {
                    seeker_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    full_name = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true, defaultValueSql: "(NULL)"),
                    date_of_birth = table.Column<DateOnly>(type: "date", nullable: true, defaultValueSql: "(NULL)"),
                    gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true, defaultValueSql: "(NULL)"),
                    phone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true, defaultValueSql: "(NULL)"),
                    address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    skills = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    education_level = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true, defaultValueSql: "(NULL)"),
                    experience_years = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_job_seekers_seeker_id", x => x.seeker_id);
                });

            migrationBuilder.CreateTable(
                name: "messages",
                schema: "tuyendung",
                columns: table => new
                {
                    message_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    sender_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    receiver_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    is_read = table.Column<short>(type: "smallint", nullable: true, defaultValueSql: "(NULL)"),
                    created_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_messages_message_id", x => x.message_id);
                });

            migrationBuilder.CreateTable(
                name: "notifications",
                schema: "tuyendung",
                columns: table => new
                {
                    notification_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    type = table.Column<string>(type: "nvarchar(18)", maxLength: 18, nullable: false),
                    title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    related_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    is_read = table.Column<short>(type: "smallint", nullable: true, defaultValue: (short)0),
                    created_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notifications_notification_id", x => x.notification_id);
                });

            migrationBuilder.CreateTable(
                name: "resumes",
                schema: "tuyendung",
                columns: table => new
                {
                    resume_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    seeker_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    summary = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    experience = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    education = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    skills = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    created_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(NULL)"),
                    updated_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resumes_resume_id", x => x.resume_id);
                });

            migrationBuilder.CreateTable(
                name: "seeker_feedback",
                schema: "tuyendung",
                columns: table => new
                {
                    feedback_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    employer_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    seeker_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    rating = table.Column<short>(type: "smallint", nullable: true, defaultValueSql: "(NULL)"),
                    comment = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true, defaultValueSql: "(NULL)"),
                    created_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_seeker_feedback_feedback_id", x => x.feedback_id);
                });

            migrationBuilder.CreateTable(
                name: "service_packages",
                schema: "tuyendung",
                columns: table => new
                {
                    package_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true, defaultValueSql: "(NULL)"),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    price = table.Column<float>(type: "real", nullable: true, defaultValueSql: "(NULL)"),
                    duration_days = table.Column<short>(type: "smallint", nullable: true, defaultValueSql: "(NULL)"),
                    features = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_service_packages_package_id", x => x.package_id);
                });

            migrationBuilder.CreateTable(
                name: "transactions",
                schema: "tuyendung",
                columns: table => new
                {
                    transaction_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    package_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    amount = table.Column<decimal>(type: "decimal(10,2)", nullable: true, defaultValueSql: "(NULL)"),
                    status = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    created_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_transactions_transaction_id", x => x.transaction_id);
                });

            migrationBuilder.CreateTable(
                name: "user_profiles",
                schema: "tuyendung",
                columns: table => new
                {
                    profile_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    full_name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValueSql: "(NULL)"),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    bio = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    updated_at = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_profiles_profile_id", x => x.profile_id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                schema: "tuyendung",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    full_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    avatar = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    account_type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true, defaultValue: "normal"),
                    google_id = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    facebook_id = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    is_verified = table.Column<short>(type: "smallint", nullable: true, defaultValue: (short)0),
                    status = table.Column<short>(type: "smallint", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    last_login = table.Column<DateTime>(type: "datetime", nullable: true),
                    IdentityUserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users_user_id", x => x.user_id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "employers",
                schema: "tuyendung",
                columns: table => new
                {
                    employer_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    company_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true, defaultValueSql: "(NULL)"),
                    company_website = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    company_size = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true, defaultValueSql: "(NULL)"),
                    industry_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    phone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true, defaultValueSql: "(NULL)"),
                    address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    logo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employers_employer_id", x => x.employer_id);
                    table.ForeignKey(
                        name: "FK_employers_industry_industry_id",
                        column: x => x.industry_id,
                        principalSchema: "tuyendung",
                        principalTable: "industry",
                        principalColumn: "industry_id");
                });

            migrationBuilder.CreateTable(
                name: "job_posts",
                schema: "tuyendung",
                columns: table => new
                {
                    job_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    employer_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    category_id = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    requirements = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    salary_range = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    job_type = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    location = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValueSql: "(NULL)"),
                    status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true, defaultValueSql: "(NULL)"),
                    created_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(NULL)"),
                    updated_at = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true, defaultValueSql: "(NULL)"),
                    level = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true, defaultValueSql: "(NULL)"),
                    education = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true, defaultValueSql: "(NULL)"),
                    quantity = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(NULL)"),
                    work_form = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true, defaultValueSql: "(NULL)"),
                    images = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValueSql: "(NULL)"),
                    view_count = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    deadline = table.Column<DateTime>(type: "datetime", nullable: true),
                    is_approved = table.Column<short>(type: "smallint", nullable: true, defaultValue: (short)1)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_job_posts_job_id", x => x.job_id);
                    table.ForeignKey(
                        name: "FK_job_posts_employers_employer_id",
                        column: x => x.employer_id,
                        principalSchema: "tuyendung",
                        principalTable: "employers",
                        principalColumn: "employer_id");
                    table.ForeignKey(
                        name: "FK_job_posts_job_categories_category_id",
                        column: x => x.category_id,
                        principalSchema: "tuyendung",
                        principalTable: "job_categories",
                        principalColumn: "category_id");
                });

            migrationBuilder.CreateIndex(
                name: "applications$application_id",
                schema: "tuyendung",
                table: "applications",
                column: "application_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "cv_id",
                schema: "tuyendung",
                table: "applications",
                column: "cv_id");

            migrationBuilder.CreateIndex(
                name: "job_id",
                schema: "tuyendung",
                table: "applications",
                column: "job_id");

            migrationBuilder.CreateIndex(
                name: "resume_id",
                schema: "tuyendung",
                table: "applications",
                column: "resume_id");

            migrationBuilder.CreateIndex(
                name: "seeker_id",
                schema: "tuyendung",
                table: "applications",
                column: "seeker_id");

            migrationBuilder.CreateIndex(
                name: "article_categories$category_id",
                schema: "tuyendung",
                table: "article_categories",
                column: "category_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "article_tags$name",
                schema: "tuyendung",
                table: "article_tags",
                column: "name",
                unique: true,
                filter: "[name] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "article_tags$tag_id",
                schema: "tuyendung",
                table: "article_tags",
                column: "tag_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "career_articles$article_id",
                schema: "tuyendung",
                table: "career_articles",
                column: "article_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "career_articles$slug",
                schema: "tuyendung",
                table: "career_articles",
                column: "slug",
                unique: true,
                filter: "[slug] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "cv_uploads$cv_id",
                schema: "tuyendung",
                table: "cv_uploads",
                column: "cv_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "seeker_id",
                schema: "tuyendung",
                table: "cv_uploads",
                column: "seeker_id");

            migrationBuilder.CreateIndex(
                name: "employer_id",
                schema: "tuyendung",
                table: "employer_packages",
                column: "employer_id");

            migrationBuilder.CreateIndex(
                name: "package_id",
                schema: "tuyendung",
                table: "employer_packages",
                column: "package_id");

            migrationBuilder.CreateIndex(
                name: "employer_id",
                schema: "tuyendung",
                table: "employer_reviews",
                column: "employer_id");

            migrationBuilder.CreateIndex(
                name: "employer_reviews$review_id",
                schema: "tuyendung",
                table: "employer_reviews",
                column: "review_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "seeker_id",
                schema: "tuyendung",
                table: "employer_reviews",
                column: "seeker_id");

            migrationBuilder.CreateIndex(
                name: "employers$employer_id",
                schema: "tuyendung",
                table: "employers",
                column: "employer_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "employers$user_id",
                schema: "tuyendung",
                table: "employers",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "industry_id",
                schema: "tuyendung",
                table: "employers",
                column: "industry_id");

            migrationBuilder.CreateIndex(
                name: "industry$industry_id",
                schema: "tuyendung",
                table: "industry",
                column: "industry_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "job_categories$category_id",
                schema: "tuyendung",
                table: "job_categories",
                column: "category_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "category_id",
                schema: "tuyendung",
                table: "job_post_categories",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "job_id",
                schema: "tuyendung",
                table: "job_post_features",
                column: "job_id");

            migrationBuilder.CreateIndex(
                name: "category_id",
                schema: "tuyendung",
                table: "job_posts",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "employer_id",
                schema: "tuyendung",
                table: "job_posts",
                column: "employer_id");

            migrationBuilder.CreateIndex(
                name: "job_posts$job_id",
                schema: "tuyendung",
                table: "job_posts",
                column: "job_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "job_seekers$seeker_id",
                schema: "tuyendung",
                table: "job_seekers",
                column: "seeker_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "job_seekers$user_id",
                schema: "tuyendung",
                table: "job_seekers",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "messages$message_id",
                schema: "tuyendung",
                table: "messages",
                column: "message_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "receiver_id",
                schema: "tuyendung",
                table: "messages",
                column: "receiver_id");

            migrationBuilder.CreateIndex(
                name: "sender_id",
                schema: "tuyendung",
                table: "messages",
                column: "sender_id");

            migrationBuilder.CreateIndex(
                name: "created_at",
                schema: "tuyendung",
                table: "notifications",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "idx_user_created",
                schema: "tuyendung",
                table: "notifications",
                columns: new[] { "user_id", "created_at" });

            migrationBuilder.CreateIndex(
                name: "idx_user_read",
                schema: "tuyendung",
                table: "notifications",
                columns: new[] { "user_id", "is_read" });

            migrationBuilder.CreateIndex(
                name: "is_read",
                schema: "tuyendung",
                table: "notifications",
                column: "is_read");

            migrationBuilder.CreateIndex(
                name: "user_id",
                schema: "tuyendung",
                table: "notifications",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "resumes$resume_id",
                schema: "tuyendung",
                table: "resumes",
                column: "resume_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "seeker_id",
                schema: "tuyendung",
                table: "resumes",
                column: "seeker_id");

            migrationBuilder.CreateIndex(
                name: "employer_id",
                schema: "tuyendung",
                table: "seeker_feedback",
                column: "employer_id");

            migrationBuilder.CreateIndex(
                name: "seeker_feedback$feedback_id",
                schema: "tuyendung",
                table: "seeker_feedback",
                column: "feedback_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "seeker_id",
                schema: "tuyendung",
                table: "seeker_feedback",
                column: "seeker_id");

            migrationBuilder.CreateIndex(
                name: "service_packages$package_id",
                schema: "tuyendung",
                table: "service_packages",
                column: "package_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "transactions$transaction_id",
                schema: "tuyendung",
                table: "transactions",
                column: "transaction_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "user_profiles$user_id",
                schema: "tuyendung",
                table: "user_profiles",
                column: "user_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "applications",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "article_categories",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "article_category_map",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "article_tag_map",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "article_tags",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "career_articles",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "cv_uploads",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "employer_packages",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "employer_reviews",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "job_post_categories",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "job_post_features",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "job_posts",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "job_seekers",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "messages",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "notifications",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "resumes",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "seeker_feedback",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "service_packages",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "transactions",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "user_profiles",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "users",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "employers",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "job_categories",
                schema: "tuyendung");

            migrationBuilder.DropTable(
                name: "industry",
                schema: "tuyendung");
        }
    }
}
