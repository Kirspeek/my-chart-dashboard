export const WeatherUtils = {
  /**
   * Convert weather code to description
   */
  getWeatherDescription(code: number): string {
    if (code === 0) return "Clear sky";
    if (code === 1 || code === 2 || code === 3) return "Partly cloudy";
    if (code === 45 || code === 48) return "Fog";
    if (code === 51 || code === 53 || code === 55) return "Drizzle";
    if (code === 61 || code === 63 || code === 65) return "Rain";
    if (code === 71 || code === 73 || code === 75) return "Snow";
    if (code === 80 || code === 81 || code === 82) return "Showers";
    if (code === 95) return "Thunderstorm";
    if (code === 96 || code === 99) return "Thunderstorm with hail";
    return "Unknown";
  },

  /**
   * Get weather icon based on description
   */
  getWeatherIcon(desc: string): string {
    if (/clear/i.test(desc)) return "☀️";
    if (/cloud/i.test(desc)) return "🌤️";
    if (/rain/i.test(desc)) return "🌧️";
    if (/storm|thunder/i.test(desc)) return "⛈️";
    if (/snow/i.test(desc)) return "❄️";
    return "🌡️";
  },
};
