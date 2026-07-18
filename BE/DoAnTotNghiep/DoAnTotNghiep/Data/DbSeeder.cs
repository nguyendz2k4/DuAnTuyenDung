using DoAnTotNghiep.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DoAnTotNghiep.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAdminUserAsync(
            IServiceProvider serviceProvider)
        {
            var userManager =
                serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            var roleManager =
                serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            var dbContext =
                serviceProvider.GetRequiredService<AppDbContext>();

            var configuration =
                serviceProvider.GetRequiredService<IConfiguration>();

            var adminEmail =
                configuration["AdminAccount:Email"]
                ?? throw new InvalidOperationException(
                    "Chưa cấu hình AdminAccount:Email.");

            var adminPassword =
                configuration["AdminAccount:Password"]
                ?? throw new InvalidOperationException(
                    "Chưa cấu hình AdminAccount:Password.");

            await using var transaction =
                await dbContext.Database.BeginTransactionAsync();

            try
            {
                var roleNames = new[]
                {
                    "Admin",
                    "Employer",
                    "JobSeeker"
                };

                foreach (var roleName in roleNames)
                {
                    if (await roleManager.RoleExistsAsync(roleName))
                    {
                        continue;
                    }

                    var createRoleResult =
                        await roleManager.CreateAsync(
                            new IdentityRole
                            {
                                Name = roleName
                            });

                    EnsureIdentitySucceeded(
                        createRoleResult,
                        $"Không thể tạo role {roleName}");
                }

                // Bước 2: Đảm bảo tài khoản Identity tồn tại
                var adminUser =
                    await userManager.FindByEmailAsync(adminEmail);

                if (adminUser == null)
                {
                    adminUser = new ApplicationUser
                    {
                        UserName = adminEmail,
                        Email = adminEmail,
                        EmailConfirmed = true
                    };

                    var createUserResult =
                        await userManager.CreateAsync(
                            adminUser,
                            adminPassword);

                    EnsureIdentitySucceeded(
                        createUserResult,
                        "Không thể tạo tài khoản admin");
                }
                else if (!await userManager.CheckPasswordAsync(
                    adminUser,
                    adminPassword))
                {
                    var resetPasswordResult =
                        await userManager.ResetPasswordAsync(
                            adminUser,
                            await userManager.GeneratePasswordResetTokenAsync(adminUser),
                            adminPassword);

                    EnsureIdentitySucceeded(
                        resetPasswordResult,
                        "Không thể đồng bộ mật khẩu admin từ cấu hình");
                }

                // Bước 3: Đảm bảo tài khoản có role Admin
                if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
                {
                    var addRoleResult =
                        await userManager.AddToRoleAsync(
                            adminUser,
                            "Admin");

                    EnsureIdentitySucceeded(
                        addRoleResult,
                        "Không thể gán role Admin");
                }

                // Bước 4: Đảm bảo domain User tồn tại
                var customUser = await dbContext.DomainUsers
                    .FirstOrDefaultAsync(
                        user => user.IdentityUserId == adminUser.Id);

                var now = DateTime.UtcNow;

                if (customUser == null)
                {
                    customUser = new User
                    {
                        IdentityUserId = adminUser.Id,
                        FullName = "Võ Trung Nguyên",
                        Status = 1,
                        CreatedAt = now,
                        UpdatedAt = now
                    };

                    dbContext.DomainUsers.Add(customUser);
                    await dbContext.SaveChangesAsync();
                }
                else
                {
                    customUser.Status = 1;
                    customUser.UpdatedAt = now;
                }

                // Bước 5: Đảm bảo UserProfile tồn tại
                var userProfile = await dbContext.UserProfiles
                    .FirstOrDefaultAsync(
                        profile => profile.UserId == customUser.UserId);

                if (userProfile == null)
                {
                    userProfile = new UserProfile
                    {
                        UserId = customUser.UserId,
                        FullName = customUser.FullName,
                        CreatedAt = now,
                        UpdatedAt = now
                    };

                    dbContext.UserProfiles.Add(userProfile);
                }
                else
                {
                    userProfile.FullName = customUser.FullName;
                    userProfile.UpdatedAt = now;
                }

                await dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private static void EnsureIdentitySucceeded(
            IdentityResult result,
            string message)
        {
            if (result.Succeeded)
            {
                return;
            }

            var errors = string.Join(
                "; ",
                result.Errors.Select(error =>
                    $"{error.Code}: {error.Description}"));

            throw new InvalidOperationException(
                $"{message}. Chi tiết: {errors}");
        }
    }
}
