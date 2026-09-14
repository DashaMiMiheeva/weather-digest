export const config = {
  geocodingBaseUrl:
    process.env.GEOCODING_BASE_URL ||
    'https://geocoding-api.open-meteo.com/v1/search',

  forecastBaseUrl:
    process.env.FORECAST_BASE_URL ||
    'https://api.open-meteo.com/v1/forecast',

  requestTimeout: Number(
    process.env.REQUEST_TIMEOUT || 5000
  ),

  reportsDir:
    process.env.REPORTS_DIR || 'reports',

  temperatureUnit:
    process.env.TEMPERATURE_UNIT || 'celsius',

  precipitationUnit:
    process.env.PRECIPITATION_UNIT || 'mm',

  language:
    process.env.LANGUAGE || 'ru'
};