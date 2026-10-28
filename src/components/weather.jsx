import { useState } from "react";
import axios from "axios";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchWeather = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    if (!apiKey) {
      setError("Please configure your Weather API key.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: city.trim(),
            appid: apiKey,
            units: "metric",
          },
        }
      );

      setWeather(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("City not found. Please try again.");
      } else if (err.response?.status === 401) {
        setError("Invalid API key. Check your API key.");
      } else {
        setError("Unable to fetch weather. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="weather-card">
      <div className="sun-icon">🌤️</div>
      <h1>Weather Report</h1>
      <p className="subtitle">
        Discover the weather around the world
      </p>

      <form className="search-form" onSubmit={searchWeather}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          aria-label="City name"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
        <section className="weather-result">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />

          <h3>{Math.round(weather.main.temp)}°C</h3>
          <p className="description">
            {weather.weather[0].description}
          </p>

          <div className="details">
            <div>
              <span>🌡️</span>
              <p>Feels Like</p>
              <strong>{Math.round(weather.main.feels_like)}°C</strong>
            </div>

            <div>
              <span>💧</span>
              <p>Humidity</p>
              <strong>{weather.main.humidity}%</strong>
            </div>

            <div>
              <span>💨</span>
              <p>Wind Speed</p>
              <strong>{weather.wind.speed} m/s</strong>
            </div>
          </div>
        </section>
      )}

      <footer>Powered by OpenWeather API</footer>
    </main>
  );
}

export default Weather;