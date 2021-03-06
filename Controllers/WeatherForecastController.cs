using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using LibraryApp.Infrastructure;
using LibraryApp.Services;

namespace LibraryApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherForecastController : ControllerBase
    {

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IOpenWeatherService _weatherService;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IOpenWeatherService weatherService)
        {
            _logger = logger;
            _weatherService = weatherService;
        }

        [HttpGet("{location}")]
        public async Task<IActionResult> Get(string location, Unit unit = Unit.Metric)
        {
            if (string.IsNullOrEmpty(location))
                return BadRequest("location parameter is missing");
            try
            {
                var forecast = await _weatherService.GetFiveDayForecastAsync(location, unit);
                return Ok(forecast);
            }
            catch (OpenWeatherException e)
            {
                if (e.StatusCode == HttpStatusCode.NotFound)
                    return BadRequest($"Location: \"{ location }\" not found.");
                else
                    return StatusCode(500, e.Message);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
    }
}