using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using LibraryApp.Config;
using LibraryApp.Infrastructure;
using LibraryApp.Models;

namespace LibraryApp.Services
{
    public enum Unit
    {
        Metric,
        Imperial,
        Kelvin
    }

    public interface IOpenWeatherService
    {
        Task<List<WeatherForecast>> GetFiveDayForecastAsync(string location, Unit unit = Unit.Metric);
    }
    
    public class OpenWeatherService : IOpenWeatherService
    {
        private readonly OpenWeather _openWeatherConfig;
        private readonly IHttpClientFactory _httpFactory;

        public OpenWeatherService(IOptions<OpenWeather> opts, IHttpClientFactory httpFactory)
        {
            _openWeatherConfig = opts.Value;
            _httpFactory = httpFactory;
        }

        public async Task<List<WeatherForecast>> GetFiveDayForecastAsync(string location, Unit unit = Unit.Metric)
        {
            string url = BuildOpenWeatherUrl("weather", location, unit);
            var forecasts = new List<WeatherForecast>();
           
            var client = _httpFactory.CreateClient("OpenWeatherClient");
            var response = await client.GetAsync(url);
            
            if (response.IsSuccessStatusCode)
            {
                var jsonOpts = new JsonSerializerOptions {IgnoreNullValues = true, PropertyNameCaseInsensitive = true};
                var contentStream = await response.Content.ReadAsStreamAsync();
                var openWeatherResponse = await JsonSerializer.DeserializeAsync<Root>(contentStream, jsonOpts);
                
                foreach (var weather in openWeatherResponse.weather)
                {
                    forecasts.Add(new WeatherForecast
                    {
                        Name = openWeatherResponse.name,
                        Date = (new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(openWeatherResponse.dt).ToLocalTime()).ToString("F"),
                        //DateTimeOffset.FromUnixTimeSeconds((openWeatherResponse.dt).ToString()).ToString();
                        Main = weather.main,
                        Description = weather.description,
                        Icon = weather.icon,
                        Temp = openWeatherResponse.main.temp,
                        FeelsLike = openWeatherResponse.main.feels_like,
                        TempMin = openWeatherResponse.main.temp_min,
                        TempMax = openWeatherResponse.main.temp_max,

                    });
                };
                

                return forecasts;
            }
    
            else
            {
                throw new OpenWeatherException(response.StatusCode, "Error response from OpenWeatherApi: " + response.ReasonPhrase);
            } 
        }
        
        private string BuildOpenWeatherUrl(string resource, string location, Unit unit)
        {
            return $"https://api.openweathermap.org/data/2.5/{resource}" +
                   $"?appid={_openWeatherConfig.ApiKey}" +
                   $"&q={location}" +
                   $"&units={unit}";
        }
    }
}