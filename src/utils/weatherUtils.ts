/* Weather Utility Functions */

export interface WeatherColors {
  mainColor: string;
  secondaryColor: string;
}

export interface WeatherBackground {
  background: string;
}

export interface WeatherButtonBackground {
  background: string;
}

/**
 * Get weather text colors based on weather description
 */
export function getWeatherColors(
  desc: string,
  hot: boolean = false
): WeatherColors {
  if (hot) {
    return {
      mainColor: "var(--weather-text-hot)",
      secondaryColor: "var(--weather-text-hot)",
    };
  }

  if (/clear sky/i.test(desc)) {
    return {
      mainColor: "var(--weather-text-clear)",
      secondaryColor: "var(--weather-text-clear)",
    };
  }

  if (/sunny/i.test(desc)) {
    return {
      mainColor: "var(--weather-text-clear)",
      secondaryColor: "var(--weather-text-clear)",
    };
  }

  if (/partly cloudy/i.test(desc)) {
    return {
      mainColor: "var(--weather-text-cloudy)",
      secondaryColor: "var(--weather-text-cloudy)",
    };
  }

  if (/cloudy/i.test(desc)) {
    return {
      mainColor: "var(--weather-text-teal)",
      secondaryColor: "var(--weather-text-teal)",
    };
  }

  if (/rain/i.test(desc)) {
    return {
      mainColor: "var(--weather-text-cloudy)",
      secondaryColor: "var(--weather-text-cloudy)",
    };
  }

  if (/showers/i.test(desc)) {
    return {
      mainColor: "var(--weather-text-cloudy)",
      secondaryColor: "var(--weather-text-cloudy)",
    };
  }

  if (/drizzle/i.test(desc)) {
    return {
      mainColor: "var(--weather-text-cloudy)",
      secondaryColor: "var(--weather-text-cloudy)",
    };
  }

  if (/snow/i.test(desc)) {
    return {
      mainColor: "var(--weather-text-teal)",
      secondaryColor: "var(--weather-text-teal)",
    };
  }

  if (/fog/i.test(desc)) {
    return {
      mainColor: "var(--weather-text-gray)",
      secondaryColor: "var(--weather-text-gray)",
    };
  }

  if (/thunderstorm/i.test(desc)) {
    return {
      mainColor: "var(--weather-text-thunderstorm)",
      secondaryColor: "var(--weather-text-thunderstorm)",
    };
  }

  if (/cold/i.test(desc)) {
    return {
      mainColor: "var(--weather-text-cloudy)",
      secondaryColor: "var(--weather-text-cloudy)",
    };
  }

  // Default colors
  return {
    mainColor: "var(--weather-text-primary)",
    secondaryColor: "var(--weather-text-secondary)",
  };
}

/**
 * Get weather background gradient based on weather description
 */
export function getWeatherBackground(desc: string): WeatherBackground {
  if (/partly cloudy|cloudy/i.test(desc)) {
    return { background: "var(--weather-bg-partly-cloudy)" };
  }

  if (/thunderstorm/i.test(desc)) {
    return { background: "var(--weather-bg-thunderstorm)" };
  }

  if (/clear sky/i.test(desc)) {
    return { background: "var(--weather-bg-clear)" };
  }

  if (/sunny/i.test(desc)) {
    return { background: "var(--weather-bg-sunny)" };
  }

  if (/rain/i.test(desc)) {
    return { background: "var(--weather-bg-rain)" };
  }

  if (/showers/i.test(desc)) {
    return { background: "var(--weather-bg-showers)" };
  }

  if (/drizzle/i.test(desc)) {
    return { background: "var(--weather-bg-drizzle)" };
  }

  if (/snow/i.test(desc)) {
    return { background: "var(--weather-bg-snow)" };
  }

  if (/fog/i.test(desc)) {
    return { background: "var(--weather-bg-fog)" };
  }

  if (/hot|very hot|heat|accent-red/i.test(desc)) {
    return { background: "var(--weather-bg-hot)" };
  }

  if (/cold/i.test(desc)) {
    return { background: "var(--weather-bg-cold)" };
  }

  // Default background
  return { background: "var(--weather-bg-default)" };
}

/**
 * Get selected button background gradient based on weather description
 */
export function getSelectedButtonBackground(
  desc: string
): WeatherButtonBackground {
  if (/thunderstorm/i.test(desc)) {
    return { background: "var(--weather-btn-thunderstorm)" };
  }

  if (/hot|very hot|heat|accent-red|showers|drizzle/i.test(desc)) {
    return { background: "var(--weather-btn-hot)" };
  }

  if (/rain/i.test(desc)) {
    return { background: "var(--weather-btn-rain)" };
  }

  if (/partly cloudy/i.test(desc)) {
    return { background: "var(--weather-btn-partly-cloudy)" };
  }

  if (/clear sky|sunny/i.test(desc)) {
    return { background: "var(--weather-btn-sunny)" };
  }

  // Default background
  return { background: "var(--weather-btn-default)" };
}

/**
 * Parse date string into day of week and rest of date
 */
export function parseDate(date: string): {
  dayOfWeek: string;
  restOfDate: string;
} {
  let dayOfWeek = "";
  let restOfDate = date;

  if (date) {
    const match = date.match(/^(\w+),?\s*(.*)$/);
    if (match) {
      dayOfWeek = match[1];
      restOfDate = match[2];
    }
  }

  return { dayOfWeek, restOfDate };
}
