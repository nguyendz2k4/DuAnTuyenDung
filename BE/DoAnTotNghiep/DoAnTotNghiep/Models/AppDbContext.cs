using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DoAnTotNghiep.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Application> Applications { get; set; }

    public virtual DbSet<ArticleCategory> ArticleCategories { get; set; }

    public virtual DbSet<ArticleCategoryMap> ArticleCategoryMaps { get; set; }

    public virtual DbSet<ArticleTag> ArticleTags { get; set; }

    public virtual DbSet<ArticleTagMap> ArticleTagMaps { get; set; }

    public virtual DbSet<CareerArticle> CareerArticles { get; set; }

    public virtual DbSet<CvUpload> CvUploads { get; set; }

    public virtual DbSet<Employer> Employers { get; set; }

    public virtual DbSet<EmployerPackage> EmployerPackages { get; set; }

    public virtual DbSet<EmployerReview> EmployerReviews { get; set; }

    public virtual DbSet<Industry> Industries { get; set; }

    public virtual DbSet<JobCategory> JobCategories { get; set; }

    public virtual DbSet<JobPost> JobPosts { get; set; }

    public virtual DbSet<JobPostCategory> JobPostCategories { get; set; }

    public virtual DbSet<JobPostFeature> JobPostFeatures { get; set; }

    public virtual DbSet<JobSeeker> JobSeekers { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Resume> Resumes { get; set; }

    public virtual DbSet<SeekerFeedback> SeekerFeedbacks { get; set; }

    public virtual DbSet<ServicePackage> ServicePackages { get; set; }

    public virtual DbSet<Transaction> Transactions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserProfile> UserProfiles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Application>(entity =>
        {
            entity.HasKey(e => e.ApplicationId).HasName("PK_applications_application_id");

            entity.Property(e => e.AppliedAt).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.CoverLetter).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.CvId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Email).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.FullName).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.JobId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Location).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Phone).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.ResumeId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.SeekerId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Status).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<ArticleCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK_article_categories_category_id");

            entity.Property(e => e.Description).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Name).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<ArticleCategoryMap>(entity =>
        {
            entity.HasKey(e => new { e.ArticleId, e.CategoryId }).HasName("PK_article_category_map_article_id");
        });

        modelBuilder.Entity<ArticleTag>(entity =>
        {
            entity.HasKey(e => e.TagId).HasName("PK_article_tags_tag_id");

            entity.Property(e => e.Name).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<ArticleTagMap>(entity =>
        {
            entity.HasKey(e => new { e.ArticleId, e.TagId }).HasName("PK_article_tag_map_article_id");
        });

        modelBuilder.Entity<CareerArticle>(entity =>
        {
            entity.HasKey(e => e.ArticleId).HasName("PK_career_articles_article_id");

            entity.Property(e => e.AuthorId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Content).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Slug).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Title).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<CvUpload>(entity =>
        {
            entity.HasKey(e => e.CvId).HasName("PK_cv_uploads_cv_id");

            entity.Property(e => e.FilePath).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.FileType).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.SeekerId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.UploadedAt).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<Employer>(entity =>
        {
            entity.HasKey(e => e.EmployerId).HasName("PK_employers_employer_id");

            entity.Property(e => e.Address).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.CompanyName).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.CompanySize).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.CompanyWebsite).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Description).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.IndustryId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Logo).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Phone).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<EmployerPackage>(entity =>
        {
            entity.HasKey(e => e.EmployerPackageId).HasName("PK_employer_packages_employer_package_id");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Status).HasDefaultValue("active");
        });

        modelBuilder.Entity<EmployerReview>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK_employer_reviews_review_id");

            entity.Property(e => e.Comment).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.EmployerId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Rating).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.SeekerId).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<Industry>(entity =>
        {
            entity.HasKey(e => e.IndustryId).HasName("PK_industry_industry_id");

            entity.Property(e => e.NameIndustry).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<JobCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK_job_categories_category_id");

            entity.Property(e => e.Description).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Name).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<JobPost>(entity =>
        {
            entity.HasKey(e => e.JobId).HasName("PK_job_posts_job_id");

            entity.Property(e => e.CategoryId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Description).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Education).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.EmployerId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Images).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.IsApproved).HasDefaultValue((short)1);
            entity.Property(e => e.JobType).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Level).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Location).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Quantity).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Requirements).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.SalaryRange).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Status).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Title).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.ViewCount).HasDefaultValue(0);
            entity.Property(e => e.WorkForm).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<JobPostCategory>(entity =>
        {
            entity.HasKey(e => new { e.JobId, e.CategoryId }).HasName("PK_job_post_categories_job_id");
        });

        modelBuilder.Entity<JobPostFeature>(entity =>
        {
            entity.HasKey(e => e.JobPostFeatureId).HasName("PK_job_post_features_job_post_feature_id");

            entity.Property(e => e.Priority).HasDefaultValue(0);
        });

        modelBuilder.Entity<JobSeeker>(entity =>
        {
            entity.HasKey(e => e.SeekerId).HasName("PK_job_seekers_seeker_id");

            entity.Property(e => e.Address).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.DateOfBirth).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.EducationLevel).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.ExperienceYears).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.FullName).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Gender).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Phone).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Skills).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK_messages_message_id");

            entity.Property(e => e.Content).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.IsRead).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.ReceiverId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.SenderId).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK_notifications_notification_id");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsRead).HasDefaultValue((short)0);
            entity.Property(e => e.RelatedId).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<Resume>(entity =>
        {
            entity.HasKey(e => e.ResumeId).HasName("PK_resumes_resume_id");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Education).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Experience).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.SeekerId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Skills).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Summary).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Title).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<SeekerFeedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK_seeker_feedback_feedback_id");

            entity.Property(e => e.Comment).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.EmployerId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Rating).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.SeekerId).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<ServicePackage>(entity =>
        {
            entity.HasKey(e => e.PackageId).HasName("PK_service_packages_package_id");

            entity.Property(e => e.Description).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.DurationDays).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Features).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Name).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Price).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.TransactionId).HasName("PK_transactions_transaction_id");

            entity.Property(e => e.Amount).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.PackageId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Status).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.UserId).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK_users_user_id");

            entity.Property(e => e.AccountType).HasDefaultValue("normal");
            entity.Property(e => e.Avatar).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Email).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.FacebookId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.FullName).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.GoogleId).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.IsVerified).HasDefaultValue((short)0);
            entity.Property(e => e.LastLogin).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.PasswordHash).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Phone).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Role).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Status).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Username).HasDefaultValueSql("(NULL)");
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.ProfileId).HasName("PK_user_profiles_profile_id");

            entity.Property(e => e.Address).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Bio).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FullName).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.Phone).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
