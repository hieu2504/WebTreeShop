using AutoMapper;
using TreeShop.Api.Data;
using TreeShop.Api.ViewModel;

namespace TreeShop.Api.Infrastructure.Extention
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AppUser, AppUserViewModel>().ReverseMap();
            CreateMap<AppRole, AppRoleViewModel>().ReverseMap();
            CreateMap<Category, CategoryViewModel>().ReverseMap();
            CreateMap<Product, ProductViewModel>().ReverseMap();
            CreateMap<Order, OrderViewModel>().ReverseMap();
            CreateMap<Payment, PaymentViewModel>().ReverseMap();
            CreateMap<OrderDetail, OrderDetailViewModel>().ReverseMap();
            CreateMap<TransactStatus, TransactStatusViewModel>().ReverseMap();
            CreateMap<NewsPost, NewsPostViewModel>().ReverseMap();
            
        }
    }
}
