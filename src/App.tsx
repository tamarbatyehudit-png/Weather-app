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

  const cities = [
    { name: 'London', lat: 51.51, lon: -0.13 },
    { name: 'New York', lat: 40.71, lon: -74.01 },
    { name: 'Tokyo', lat: 35.69, lon: 139.69 },
    { name: 'Paris', lat: 48.85, lon: 2.35 },
    { name: 'Berlin', lat: 52.52, lon: 13.41 },
    { name: 'Sydney', lat: -33.87, lon: 151.21 },
    { name: 'Rome', lat: 41.90, lon: 12.50 },
    { name: 'Madrid', lat: 40.42, lon: -3.70 },
    { name: 'Cairo', lat: 30.04, lon: 31.24 },
    { name: 'Seoul', lat: 37.57, lon: 126.98 }
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      // The try block attempts the "happy path" (successful connection)
      try {
        const lats = cities.map(c => c.lat).join(',');
        const lons = cities.map(c => c.lon).join(',');
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true`;

        const response = await fetch(url);

        // Manually checking if the response is okay (e.g., not a 404 or 500 error)
        if (!response.ok) {
          throw new Error('The server responded with an error.');
        }

        const data = await response.json();

        const results = cities.map((city, index) => ({
          name: city.name,
          temp: data[index].current_weather.temperature
        }));

        setWeatherData(results);
        setLoading(false);
      } 
      // The catch block intercepts any errors during the fetch process
      catch (err) {
        setError('Unable to retrieve weather data at this time.');
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>yossi</h1>
        <div className="accent-line"></div>
      </header>

      {/* Conditional rendering for loading, errors, or data */}
      {loading && <p className="status">Fetching current data...</p>}
      
      {error && <p className="status error-text">{error}</p>}

      {!loading && !error && (
        <div className="weather-grid">
          {weatherData.map((city) => (
            <div key={city.name} className="weather-card">
              <span className="city-name">{city.name}</span>
              <span className="temp-value">{city.temp}°C</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}