using AutoMapper;
using DoAnTotNghiep.DTO.admin;
using DoAnTotNghiep.Models;

namespace DoAnTotNghiep.Mappings
{
    public class EmployerProfile : Profile
    {
        public EmployerProfile()
        {
            CreateMap<AccountsDTO, Employer>()
                .ForMember(dest => dest.CompanyName,
                           opt => opt.MapFrom(src => src.CompanyName))
                .ForMember(dest => dest.CompanyWebsite,
                           opt => opt.MapFrom(src => src.CompanyWebsite))
                .ForMember(dest => dest.Phone,
                           opt => opt.MapFrom(src => src.CompanyPhone))
                .ForMember(dest => dest.Address,
                           opt => opt.MapFrom(src => src.AddressCompany))
                .ForMember(dest => dest.Logo,
                           opt => opt.MapFrom(src => src.Logo))
                .ForMember(dest => dest.EmployerId, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.IndustryId, opt => opt.Ignore())
                .ForMember(dest => dest.CompanySize, opt => opt.Ignore())
                .ForMember(dest => dest.Description, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition(
                    (src, dest, srcMember) => srcMember != null));


            CreateMap<UpdateEmployerProfileDto, Employer>()
                .ForMember(dest => dest.EmployerId, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.IndustryId, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition(
                    (src, dest, srcMember) => srcMember != null));
        }
    }
}
