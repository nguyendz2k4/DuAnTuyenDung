using Microsoft.AspNetCore.Identity;
using DoAnTotNghiep.Models;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection; 

namespace DoAnTotNghiep.Data
{
    public class DbSeeder
    {
        public static async Task SeedAdminUserAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            var dbContext = serviceProvider.GetRequiredService<AppDbContext>();

            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            var adminEmail = "votrung920@gmail.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, "Nguyen1672004@");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");

                    var customUser = new User
                    {
                        IdentityUserId = adminUser.Id,
                        FullName = "Võ Trung Nguyên",
                        AccountType = "Admin",
                        Status = 1,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    };
                    dbContext.Set<User>().Add(customUser);
                    await dbContext.SaveChangesAsync();

                    var userProfile = new UserProfile
                    {
                        UserId = customUser.UserId,
                        FullName = customUser.FullName,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    };
                    dbContext.UserProfiles.Add(userProfile);
                    await dbContext.SaveChangesAsync();
                }
            }
        }
    }
}