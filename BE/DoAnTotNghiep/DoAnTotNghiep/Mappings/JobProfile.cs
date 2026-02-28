using AutoMapper;
using DoAnTotNghiep.DTO;
using DoAnTotNghiep.Models;

namespace DoAnTotNghiep.Mappings
{
    public class JobProfile : Profile
    {
        public JobProfile()
        {
            CreateMap<JobPost, JobDto>()
                .ForMember(dest => dest.JobId, opt => opt.MapFrom(src => src.JobId))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.SalaryRange, opt => opt.MapFrom(src => src.SalaryRange))
                .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.Location))
                .ForMember(dest => dest.JobType, opt => opt.MapFrom(src => src.JobType))
                .ForMember(dest => dest.Level, opt => opt.MapFrom(src => src.Level))
                .ForMember(dest => dest.Education, opt => opt.MapFrom(src => src.Education))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.Requirements, opt => opt.MapFrom(src => src.Requirements))

                // ===== XỬ LÝ NULL =====
                .ForMember(dest => dest.ViewCount,
                    opt => opt.MapFrom(src => src.ViewCount ?? 0))
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt ?? DateTime.Now))
                .ForMember(dest => dest.EmployerId,
                    opt => opt.MapFrom(src => src.EmployerId ?? 0))

                // ===== MAPPING TỪ CATEGORY =====
                .ForMember(dest => dest.CategoryName,
                    opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))

                // ===== MAPPING TỪ EMPLOYER =====
                .ForMember(dest => dest.IndustryId,
                    opt => opt.MapFrom(src => src.Employer != null ? src.Employer.IndustryId : null))
                .ForMember(dest => dest.CompanyName,
                    opt => opt.MapFrom(src => src.Employer != null ? src.Employer.CompanyName : null))
                .ForMember(dest => dest.CompanySize,
                    opt => opt.MapFrom(src => src.Employer != null ? src.Employer.CompanySize : null))
                .ForMember(dest => dest.Address,
                    opt => opt.MapFrom(src => src.Employer != null ? src.Employer.Address : null))
                .ForMember(dest => dest.CompanyWebsite,
                    opt => opt.MapFrom(src => src.Employer != null ? src.Employer.CompanyWebsite : null))

                // ===== XỬ LÝ LOGO/IMAGES =====
                // Images và Logo đều lấy từ Employer.Logo
                .ForMember(dest => dest.Images,
                    opt => opt.MapFrom(src => src.Employer != null ? src.Employer.Logo : null))
                .ForMember(dest => dest.Logo,
                    opt => opt.MapFrom(src => src.Employer != null ? src.Employer.Logo : null))

                // ===== MAPPING TỪ EMPLOYER.INDUSTRY (Nested) =====
                .ForMember(dest => dest.NameIndustry,
                    opt => opt.MapFrom(src => src.Employer != null && src.Employer.Industry != null
                        ? src.Employer.Industry.NameIndustry
                        : null));
        }
    }
}