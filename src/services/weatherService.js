import { findCity, getForecast } from '../api/weatherApi.js';

export async function getWeatherForCity(city, days) {
  const location = await findCity(city);

  const forecast = await getForecast(
    location.latitude,
    location.longitude,
    days
  );

  return {
    city: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    forecast: forecast.daily.time.map((date, index) => ({
      date,
      minTemperature: forecast.daily.temperature_2m_min[index],
      maxTemperature: forecast.daily.temperature_2m_max[index],
      precipitation: forecast.daily.precipitation_sum[index]
    }))
  };
}