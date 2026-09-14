import { findCity, getForecast } from '../api/weatherApi.js';
import { config } from '../config.js';
import {
  loadReport,
  saveReport
} from '../storage/reportStorage.js';

export async function getWeatherForCity(
  city,
  days,
  options = {}
) {
  const { noCache = false } = options;

  if (!noCache) {
    const cachedReport = await loadReport(
      city,
      config.reportsDir
    );

    if (
      cachedReport &&
      cachedReport.forecast &&
      cachedReport.forecast.length >= days
    ) {
      return {
        ...cachedReport,
        forecast: cachedReport.forecast.slice(0, days)
      };
    }
  }

  const location = await findCity(city);

  const forecast = await getForecast(
    location.latitude,
    location.longitude,
    days
  );

  const report = {
    city: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    forecast: forecast.daily.time.map((date, index) => ({
      date,
      minTemperature:
        forecast.daily.temperature_2m_min[index],
      maxTemperature:
        forecast.daily.temperature_2m_max[index],
      precipitation:
        forecast.daily.precipitation_sum[index]
    })),
    generatedAt: new Date().toISOString()
  };

  await saveReport(
    city,
    report,
    config.reportsDir
  );

  return report;
}