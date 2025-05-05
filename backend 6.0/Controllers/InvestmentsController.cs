using Microsoft.AspNetCore.Mvc;
using PortfolioTrackerApi.Models;
using PortfolioTrackerApi.Services;

namespace PortfolioTrackerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvestmentsController : ControllerBase
    {
        private readonly IInvestmentService _service;

        public InvestmentsController(IInvestmentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var investments = await _service.GetAllAsync();
            return Ok(investments);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var investments = await _service.GetByUserIdAsync(userId);
            return Ok(investments);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Investment investment)
        {
            if (investment == null)
                return BadRequest("Invalid investment");

            await _service.AddAsync(investment);
            return Ok("Investment added successfully");
        }
    }
}
