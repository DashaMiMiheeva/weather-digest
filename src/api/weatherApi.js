const GEOCODING_URL =
  'https://geocoding-api.open-meteo.com/v1/search';

const FORECAST_URL =
  'https://api.open-meteo.com/v1/forecast';

const REQUEST_TIMEOUT = 5000;

async function fetchJson(url) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal
    });

    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) {
        throw new Error(
          `Ошибка клиента: HTTP ${response.status}`
        );
      }

      if (response.status >= 500) {
        throw new Error(
          `Ошибка сервера: HTTP ${response.status}`
        );
      }

      throw new Error(`HTTP ошибка: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(
        'Превышено время ожидания ответа от сервера.'
      );
    }

    if (error instanceof SyntaxError) {
      throw new Error(
        'Сервер вернул некорректный JSON.'
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        'Не удалось подключиться к серверу.'
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function findCity(city) {
  const url = new URL(GEOCODING_URL);

  url.searchParams.set('name', city);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'ru');
  url.searchParams.set('format', 'json');

  const data = await fetchJson(url);

  if (!data.results || data.results.length === 0) {
    throw new Error(`Город "${city}" не найден.`);
  }

  const result = data.results[0];

  return {
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude
  };
}

export async function getForecast(latitude, longitude, days) {
  const url = new URL(FORECAST_URL);

  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);
  url.searchParams.set(
    'daily',
    'temperature_2m_max,temperature_2m_min,precipitation_sum'
  );
  url.searchParams.set('forecast_days', days);
  url.searchParams.set('timezone', 'auto');

  return fetchJson(url);
}