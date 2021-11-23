using System.Text.Json.Serialization;

namespace LibraryApp.Models
{
    public class OpenWeatherErrorResponse
    { 
        [JsonPropertyName("message")] 
        public string Message { get; }
    }
}