import React, { useState, useEffect } from 'react';
import { Sun, MapPin, Navigation, Star, Cloud, CloudRain, CloudLightning, Wind } from 'lucide-react';

const getWeatherIcon = (code) => {
  if (code === 0) return <Sun className="w-20 h-20 text-yellow-400 animate-pulse" />;
  if (code >= 1 && code <= 3) return <Cloud className="w-20 h-20 text-gray-400 animate-bounce" />;
  if (code >= 45 && code <= 67) return <CloudRain className="w-20 h-20 text-blue-400 animate-bounce" />;
  if (code >= 95) return <CloudLightning className="w-20 h-20 text-purple-400 animate-pulse" />;
  return <Wind className="w-20 h-20 text-neutral-400" />;
};

const getWeatherDesc = (code) => {
  const mapping = {
    0: "ciel dégagé",
    1: "principalement dégagé",
    2: "partiellement nuageux",
    3: "couvert",
    45: "brouillard",
    48: "brouillard givrant",
    51: "bruine légère",
    61: "pluie légère",
    95: "orage",
  };
  return mapping[code] || "conditions variables";
};

const MapSection = () => {
  const [weather, setWeather] = useState({ temp: '--', code: 0, loading: true });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=36.8935&longitude=10.1854&current_weather=true');
        const data = await res.json();
        if (data.current_weather) {
          setWeather({
            temp: Math.round(data.current_weather.temperature),
            code: data.current_weather.weathercode,
            loading: false
          });
        }
      } catch (err) {
        console.error("Failed to fetch weather:", err);
        setWeather(prev => ({ ...prev, loading: false }));
      }
    };
    fetchWeather();
  }, []);

  return (
    <section className="relative w-full h-[500px] bg-neutral-100 dark:bg-neutral-900 overflow-hidden border-y border-neutral-200 dark:border-neutral-800">
      {/* Google Maps Iframe */}
      <iframe
        title="2C Services Map"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src="https://maps.google.com/maps?q=2C%20Services%20Tunis&t=&z=16&ie=UTF8&iwloc=&output=embed"
        className="filter grayscale-[0.2] contrast-[1.1] dark:invert dark:hue-rotate-180 dark:brightness-90"
      ></iframe>

      {/* Info Card (Top Left) */}
      <div className="absolute top-6 left-6 w-72 bg-white dark:bg-neutral-900 shadow-2xl rounded-xl p-5 border border-neutral-200 dark:border-neutral-800 hidden md:block">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">2C Services</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Pôle Technologique d'El Ghazala, Ariana 2083, Tunisie
            </p>
          </div>
          <div className="bg-violet-50 dark:bg-violet-900/30 p-2 rounded-lg">
            <Navigation className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-bold text-neutral-900 dark:text-white">4,6</span>
          <div className="flex text-yellow-400">
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" className="opacity-50" />
          </div>
          <span className="text-xs text-violet-600 dark:text-violet-400 hover:underline cursor-pointer">12 avis</span>
        </div>

        <button className="w-full py-2 text-sm font-semibold text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
          Agrandir le plan
        </button>
      </div>

      {/* Weather Card (Right Side) */}
      <div className="absolute top-1/2 -translate-y-1/2 right-12 w-64 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800 text-center hidden lg:block">
        <h4 className="text-neutral-900 dark:text-white font-bold text-lg">Tunis, Tunisie</h4>
        <p className="text-xs font-bold tracking-widest text-neutral-500 dark:text-neutral-400 uppercase mt-1">WEATHER</p>
        
        <div className="my-6 flex justify-center">
          <div className="relative">
            {weather.loading ? (
              <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse"></div>
            ) : (
              <>
                {getWeatherIcon(weather.code)}
                <div className="absolute inset-0 blur-2xl bg-yellow-400/10 rounded-full"></div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-5xl font-light text-neutral-900 dark:text-white">
            {weather.temp}°C
          </span>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium lowercase">
            {weather.loading ? 'chargement...' : getWeatherDesc(weather.code)}
          </p>
        </div>
      </div>

      {/* Mobile Location Badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 px-4 py-2 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-800 flex items-center gap-2 md:hidden">
        <MapPin size={16} className="text-red-500" />
        <span className="text-sm font-bold text-neutral-900 dark:text-white">2C Services, Tunis</span>
      </div>
    </section>
  );
};

export default MapSection;
