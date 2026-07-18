using AutoMapper;
using DoAnTotNghiep.DTO.admin;
using DoAnTotNghiep.Models;

namespace DoAnTotNghiep.Mappings
{
    public class EmployerProfile : Profile
    {
        public EmployerProfile()
        {
            CreateMap<UpdateEmployerProfileDto, Employer>()
                .ForMember(dest => dest.EmployerId, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.IndustryId, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition(
                    (src, dest, srcMember) => srcMember != null));
        }
    }
}
