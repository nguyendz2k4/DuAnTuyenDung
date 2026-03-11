using AutoMapper;
using DoAnTotNghiep.DTO.admin;
using DoAnTotNghiep.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserInfor>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.Avatar, opt => opt.MapFrom(src => src.Avatar))
            .ForMember(dest => dest.AccountType, opt => opt.MapFrom(src => src.AccountType))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));

        CreateMap<UserProfile, UserInfor>(MemberList.None)
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address));

        CreateMap<Employer, UserInfor>(MemberList.None)
            .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.CompanyName))
            .ForMember(dest => dest.CompanyWebsite, opt => opt.MapFrom(src => src.CompanyWebsite))
            .ForMember(dest => dest.CompanySize, opt => opt.MapFrom(src => src.CompanySize))
            .ForMember(dest => dest.CompanyAddress, opt => opt.MapFrom(src => src.Address))
            .ForMember(dest => dest.CompanyPhone, opt => opt.MapFrom(src => src.Phone))
            .ForMember(dest => dest.Logo, opt => opt.MapFrom(src => src.Logo))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.NameIndustry, opt => opt.MapFrom(src => src.Industry != null ? src.Industry.NameIndustry : null));
    }
}