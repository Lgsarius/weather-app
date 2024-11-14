interface WeatherBackground {
  backgroundClasses: string;
  gradientColors: string;
  weatherEffect: string;
}

export const getWeatherBackground = (
  iconCode: string,
  sunrise: number,
  sunset: number
): WeatherBackground => {
  const currentTime = Math.floor(Date.now() / 1000);
  const isNight = currentTime < sunrise || currentTime > sunset;

  switch (iconCode.slice(0, 2)) {
    case '01': // clear sky
      return {
        backgroundClasses: 'bg-gradient-to-b',
        gradientColors: isNight 
          ? 'from-blue-900 via-blue-800 to-blue-900' 
          : 'from-blue-400 via-blue-300 to-blue-400',
        weatherEffect: isNight ? 'starry' : 'sunshine'
      };
    case '02': // few clouds
      return {
        backgroundClasses: 'bg-gradient-to-b',
        gradientColors: isNight 
          ? 'from-slate-900 via-slate-800 to-slate-900'
          : 'from-blue-400 via-blue-300 to-blue-200',
        weatherEffect: 'clouds'
      };
    case '03': // scattered clouds
    case '04': // broken clouds
      return {
        backgroundClasses: 'bg-gradient-to-b',
        gradientColors: isNight 
          ? 'from-slate-900 via-slate-800 to-slate-900'
          : 'from-blue-500 via-blue-400 to-blue-300',
        weatherEffect: 'clouds'
      };
    case '09': // shower rain
      return {
        backgroundClasses: 'bg-gradient-to-b',
        gradientColors: 'from-slate-700 via-slate-600 to-slate-700',
        weatherEffect: 'rain'
      };
    case '10': // rain
      return {
        backgroundClasses: 'bg-gradient-to-b',
        gradientColors: 'from-slate-600 via-slate-500 to-slate-600',
        weatherEffect: 'rain'
      };
    case '11': // thunderstorm
      return {
        backgroundClasses: 'bg-gradient-to-b',
        gradientColors: 'from-slate-900 via-slate-800 to-slate-900',
        weatherEffect: 'thunder rain'
      };
    case '13': // snow
      return {
        backgroundClasses: 'bg-gradient-to-b',
        gradientColors: 'from-slate-400 via-slate-300 to-slate-400',
        weatherEffect: 'snow'
      };
    case '50': // mist
      return {
        backgroundClasses: 'bg-gradient-to-b',
        gradientColors: 'from-gray-600 via-gray-500 to-gray-600',
        weatherEffect: 'mist'
      };
    default: // default sunrise colors
      return {
        backgroundClasses: 'bg-gradient-to-b',
        gradientColors: 'from-orange-400 via-amber-300 to-yellow-400',
        weatherEffect: 'sunshine'
      };
  }
}; 