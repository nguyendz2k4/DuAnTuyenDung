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
                .ForMember(dest => dest.CategoryName,
                    opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
                .ForMember(dest => dest.ViewCount,
                    opt => opt.MapFrom(src => src.ViewCount ?? 0))
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt ?? DateTime.Now));
        }
    }
}
