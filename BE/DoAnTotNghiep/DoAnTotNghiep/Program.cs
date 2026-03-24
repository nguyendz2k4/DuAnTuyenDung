using DoAnTotNghiep.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://0.0.0.0:7099");
builder.Services.AddHttpClient();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

var jwtKey = builder.Configuration["Jwt:Key"] ?? "saoanhlaideptraivay-nguyen2k4";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "TuyenDungApp";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "TuyenDungClient";

builder.Services.AddAuthentication()
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    })
    .AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
        options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
        options.SignInScheme = IdentityConstants.ExternalScheme;
        options.Scope.Add("profile");
        options.SaveTokens = true;
        options.Events.OnCreatingTicket = ctx =>
        {
            var picture = ctx.User.GetProperty("picture").GetString();
            if (!string.IsNullOrEmpty(picture))
                ctx.Identity?.AddClaim(new System.Security.Claims.Claim("picture", picture));
            return Task.CompletedTask;
        };
    });

builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://192.168.1.4:3000"   
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});



builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
app.UseRouting();      
app.UseCors("AllowReactApp"); 
app.UseAuthentication(); 
app.UseAuthorization();  
app.MapControllers();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        await DoAnTotNghiep.Data.DbSeeder.SeedAdminUserAsync(services);
        Console.WriteLine("Seed data Admin thanh cong!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Da xay ra loi khi seed du lieu: {ex.Message}");
    }
}
app.Run();