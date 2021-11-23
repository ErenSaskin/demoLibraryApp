using System;

namespace LibraryApp.Models
{
    public class WeatherForecast
    {
        public String Name { get; set; }
        public string Date { get; set; }
        public double Temp { get; set; }
        public string Main { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
        public double FeelsLike { get; set; }
        public double TempMin { get; set; }
        public double TempMax { get; set; }
    }
}