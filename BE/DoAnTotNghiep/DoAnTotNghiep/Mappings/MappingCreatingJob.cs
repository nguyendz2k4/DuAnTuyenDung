using AutoMapper;
using DoAnTotNghiep.DTO.admin;
using DoAnTotNghiep.Models;

namespace DoAnTotNghiep.Mappings
{
    public class MappingCreatingJob : Profile
    {
        public MappingCreatingJob() {
            CreateMap<CreateJobPostsDTO, JobPost>()
                .ForMember(dest => dest.JobId, otp => otp.Ignore())
                .ForMember(dest => dest.CreatedAt, otp => otp.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.Status, otp => otp.MapFrom(src => "active"))
                .ForMember(dest => dest.IsApproved, opt => opt.MapFrom(src => (short)0))
                .ForMember(dest => dest.ViewCount, otp => otp.MapFrom(src => 0));
        }


    }
}
