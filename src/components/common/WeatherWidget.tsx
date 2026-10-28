import React, { useEffect, useState } from 'react';
import { repository } from '@/lib/repository';
import { SUPPORTED_WEATHER_CITIES } from '@/data/seedData';
import { WeatherData, WeatherCity } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { Cloud, Sun, CloudRain, CloudLightning, Wind, Droplets, MapPin } from 'lucide-react';

interface WeatherWidgetProps {
  compact?: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ compact = false }) => {
  const { language, t } = useLanguage();
  const [selectedCityKey, setSelectedCityKey] = useState<string>('mumbai');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    repository.fetchCityWeather(selectedCityKey).then(data => {
      if (isMounted) {
        setWeather(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCityKey]);

  const selectedCity = SUPPORTED_WEATHER_CITIES.find(c => c.key === selectedCityKey) || SUPPORTED_WEATHER_CITIES[0];

  const getCityName = (city: WeatherCity): string => {
    if (language === 'hi') return city.name_hi;
    if (language === 'mr') return city.name_mr;
    return city.name_en;
  };

  const getConditionText = (w: WeatherData): string => {
    if (language === 'hi') return w.condition_hi;
    if (language === 'mr') return w.condition_mr;
    return w.condition_en;
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
    if (code <= 3) return <Cloud className="w-8 h-8 text-editorial-400" />;
    if (code <= 65) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (code <= 82) return <CloudLightning className="w-8 h-8 text-purple-600" />;
    return <Sun className="w-8 h-8 text-amber-500" />;
  };

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-editorial-700 bg-white border border-paper-border px-3 py-1.5 rounded-full shadow-2xs">
        <MapPin className="w-3.5 h-3.5 text-crimson-600" />
        <select
          value={selectedCityKey}
          onChange={e => setSelectedCityKey(e.target.value)}
          className="bg-transparent font-bold text-editorial-900 border-none outline-hidden cursor-pointer"
          aria-label="Select weather city"
        >
          {SUPPORTED_WEATHER_CITIES.map(c => (
            <option key={c.key} value={c.key}>
              {getCityName(c)}
            </option>
          ))}
        </select>
        {weather && (
          <span className="font-mono font-bold text-crimson-800">
            {weather.temperature}°C
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 border border-amber-200/80 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-amber-100 gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-amber-500 text-white rounded-lg shadow-xs">
            <Sun className="w-4 h-4" />
          </span>
          <h3 className="font-serif font-bold text-editorial-950 text-sm sm:text-base">
            {t('liveWeather')} (Weather Dispatches)
          </h3>
        </div>

        {/* City Dropdown */}
        <div className="flex items-center gap-1.5 bg-white border border-amber-200 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-crimson-600 shrink-0" />
          <select
            value={selectedCityKey}
            onChange={e => setSelectedCityKey(e.target.value)}
            className="bg-transparent font-bold text-editorial-900 border-none outline-hidden cursor-pointer text-xs"
            aria-label="City Weather Selector"
          >
            {SUPPORTED_WEATHER_CITIES.map(c => (
              <option key={c.key} value={c.key}>
                {getCityName(c)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-6 text-center text-xs text-editorial-500 font-serif">
          {t('weather')} अपडेट हो रहा है...
        </div>
      ) : weather ? (
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-xl shadow-xs border border-amber-100">
              {getWeatherIcon(weather.weatherCode)}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-mono font-black text-editorial-950">
                  {weather.temperature}°
                </span>
                <span className="text-sm font-bold text-editorial-500">C</span>
                <span className="text-xs font-semibold text-editorial-700 ml-1">
                  ({getCityName(selectedCity)})
                </span>
              </div>
              <p className="text-xs font-medium text-editorial-700 mt-0.5">
                {getConditionText(weather)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-editorial-600 bg-white/80 border border-amber-100 px-3.5 py-2 rounded-lg">
            <span className="flex items-center gap-1" title="वायु गति (Wind Speed)">
              <Wind className="w-3.5 h-3.5 text-editorial-400" />
              <span className="font-mono font-semibold">{weather.windSpeed} km/h</span>
            </span>
            {weather.humidity !== undefined && (
              <>
                <span className="text-editorial-300">|</span>
                <span className="flex items-center gap-1" title="आर्द्रता (Humidity)">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span className="font-mono font-semibold">{weather.humidity}%</span>
                </span>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
