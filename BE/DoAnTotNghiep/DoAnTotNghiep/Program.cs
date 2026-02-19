using DoAnTotNghiep.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text; 

var builder = WebApplication.CreateBuilder(args);

// Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Identity Configuration
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// ==========================================
// THÊM MỚI: CẤU HÌNH JWT AUTHENTICATION
// ==========================================
var jwtKey = builder.Configuration["Jwt:Key"] ?? "Day_La_Key_Bi_Mat_Cua_Ban_Phai_Rat_Dai_Nhe_@@@123";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "TuyenDungApp";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "TuyenDungClient";

builder.Services.AddAuthentication(options =>
{
    // Thiết lập mặc định dùng JWT
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
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
});
// ==========================================

builder.Services.AddAutoMapper(typeof(Program));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
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

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");

// MIDDLEWARE XÁC THỰC - PHÂN QUYỀN
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();