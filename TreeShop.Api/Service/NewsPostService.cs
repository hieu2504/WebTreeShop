using TreeShop.Api.Data;
using TreeShop.Api.Infrastructure.Extention;
using TreeShop.Api.Repository;

namespace TreeShop.Api.Service
{
    public interface INewsPostService
    {
        Task<IQueryable<NewsPost>> GetAll();
        Task<NewsPost> GetById(int id);
        Task<NewsPost> Add(NewsPost newsPost);
        Task<NewsPost> Update(NewsPost newsPost);
        Task<NewsPost> Delete(int id);
        Task<IQueryable<NewsPost>> GetAll(string keyword);
    }
    public class NewsPostService : INewsPostService
    {
        private readonly INewsPostRepository _newsPostRepository;
        public NewsPostService(INewsPostRepository newsPostRepository)
        {
            _newsPostRepository = newsPostRepository;
        }

        public async Task<NewsPost> Add(NewsPost newsPost)
        {
            if (await _newsPostRepository.CheckContainsAsync(x => x.Name == newsPost.Name))
            {
                throw new NameDuplicatedException("Tên bài viết đã tồn tại!");
            }
            return await _newsPostRepository.AddASync(newsPost);
        }

        public async Task<NewsPost> Delete(int id)
        {
            return await _newsPostRepository.DeleteAsync(id);
        }

        public async Task<IQueryable<NewsPost>> GetAll()
        {
            return await _newsPostRepository.GetAllAsync(x => x.Published == true);
        }

        public async Task<NewsPost> GetById(int id)
        {
            return await _newsPostRepository.GetByIdAsync(id);
        }

        public async Task<NewsPost> Update(NewsPost newsPost)
        {
            if (await _newsPostRepository.CheckContainsAsync(x => x.Name == newsPost.Name && x.PostId != newsPost.PostId))
            {
                throw new NameDuplicatedException("Tên bài viết đã tồn tại!");
            }
            return await _newsPostRepository.UpdateASync(newsPost);
        }

        public async Task<IQueryable<NewsPost>> GetAll(string keyword)
        {
            if (string.IsNullOrEmpty(keyword))
            {
                return await _newsPostRepository.GetAllAsync();
            }
            else
            {
                return await _newsPostRepository.GetAllAsync(x => x.Name.Contains(keyword) || x.Contents.Contains(keyword));
            }
        }
    }
}
