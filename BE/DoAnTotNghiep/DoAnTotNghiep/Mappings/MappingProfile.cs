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
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));

        CreateMap<UserProfile, UserInfor>(MemberList.None)
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address));
    }
}
