using System.Text.Json;
using PortfolioTrackerApi.Models;

namespace PortfolioTrackerApi.Services
{
    public class InvestmentService : IInvestmentService
    {
        private readonly string _filePath = Path.Combine("Data", "db.json");
        private List<Investment> _investments;

        public InvestmentService()
        {
            if (File.Exists(_filePath))
            {
                var json = File.ReadAllText(_filePath);
                var data = JsonSerializer.Deserialize<JsonData>(json);
                _investments = data?.Investments ?? new List<Investment>();
            }
            else
            {
                _investments = new List<Investment>();
            }
        }

        public Task<IEnumerable<Investment>> GetAllAsync() =>
            Task.FromResult(_investments.AsEnumerable());

        public Task<IEnumerable<Investment>> GetByUserIdAsync(int userId) =>
            Task.FromResult(_investments.Where(i => i.UserId == userId));

        public async Task AddAsync(Investment investment)
        {
            investment.Id = Guid.NewGuid().ToString();
            _investments.Add(investment);
            await SaveToFileAsync();
        }

        private async Task SaveToFileAsync()
        {
            var data = new JsonData { Investments = _investments };
            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(_filePath, json);
        }

        private class JsonData
        {
            public List<Investment> Investments { get; set; }
        }
    }
}
