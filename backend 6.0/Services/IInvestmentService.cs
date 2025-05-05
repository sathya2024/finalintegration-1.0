using PortfolioTrackerApi.Models;

namespace PortfolioTrackerApi.Services
{
    public interface IInvestmentService
    {
        Task<IEnumerable<Investment>> GetAllAsync();
        Task<IEnumerable<Investment>> GetByUserIdAsync(int userId);
        Task AddAsync(Investment investment);
    }
}
