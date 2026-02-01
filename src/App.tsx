import React, { useState, useEffect } from 'react';
import './App.css';

interface CityWeather {
  name: string;
  temp: number;
}

export default function App() {
  const [weatherData, setWeatherData] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Step 3: Celsius/Fahrenheit toggle state
  const [isCelsius, setIsCelsius] = useState<boolean>(true);

  // Step 4: Updated list with Tel Aviv and New Delhi (10 cities total)
  const cities = [
    { name: 'London', lat: 51.51, lon: -0.13 },
    { name: 'New York', lat: 40.71, lon: -74.01 },
    { name: 'Tokyo', lat: 35.69, lon: 139.69 },
    { name: 'Paris', lat: 48.85, lon: 2.35 },
    { name: 'Berlin', lat: 52.52, lon: 13.41 },
    { name: 'Sydney', lat: -33.87, lon: 151.21 },
    { name: 'Rome', lat: 41.90, lon: 12.50 },
    { name: 'Cairo', lat: 30.04, lon: 31.24 },
    { name: 'Tel Aviv', lat: 32.08, lon: 34.78 }, 
    { name: 'New Delhi', lat: 28.61, lon: 77.20 }
  ];

  // Helper to handle the math for Fahrenheit
  const formatTemp = (celsius: number) => {
    if (isCelsius) return `${celsius.toFixed(1)}°C`;
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${fahrenheit.toFixed(1)}°F`;
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Checking LocalStorage for the 60-second cache
        const cached = localStorage.getItem('weather_cache');
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < 60000) {
            setWeatherData(data);
            setLoading(false);
            return; 
          }
        }

        // If no fresh cache, we call the API
        const lats = cities.map(c => c.lat).join(',');
        const lons = cities.map(c => c.lon).join(',');
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        
        const results = cities.map((city, index) => ({
          name: city.name,
          temp: data[index].current_weather.temperature
        }));

        // Saving the results to LocalStorage for the next 60 seconds
        localStorage.setItem('weather_cache', JSON.stringify({
          timestamp: Date.now(),
          data: results
        }));

        setWeatherData(results);
        setLoading(false);
      } catch (err) {
        setError('Failed to load atmosphere data.');
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Atmosphere</h1>
        <div className="accent-line"></div>
        
        {!loading && !error && (
          <button 
            className="unit-toggle" 
            onClick={() => setIsCelsius(!isCelsius)}
          >
            Displaying in {isCelsius ? 'Celsius' : 'Fahrenheit'}
          </button>
        )}
      </header>

      {loading && <p className="status">Scanning horizons...</p>}
      {error && <p className="status error-text">{error}</p>}

      {!loading && !error && (
        <div className="weather-grid">
          {weatherData.map((city) => (
            <div key={city.name} className="weather-card">
              <span className="city-name">{city.name}</span>
              <span className="temp-value">{formatTemp(city.temp)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}