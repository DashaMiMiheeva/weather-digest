import { getWeatherForCity } from './services/weatherService.js';
import { formatWeatherReport } from './format/consoleFormatter.js';

function parseArguments(args) {
  let city = null;
  let days = 3;
  let noCache = false;

  for (let i = 0; i < args.length; i += 1) {
    const argument = args[i];

    if (argument === '--city') {
      const value = args[i + 1];

      if (!value || value.startsWith('--')) {
        throw new Error('После параметра --city необходимо указать город.');
      }

      city = value;
      i += 1;
    } else if (argument === '--days') {
      const value = args[i + 1];

      if (!value || value.startsWith('--')) {
        throw new Error('После параметра --days необходимо указать число.');
      }

      days = Number(value);
      i += 1;
    } else if (argument === '--no-cache') {
      noCache = true;
    } else {
      throw new Error(`Неизвестный аргумент: ${argument}`);
    }
  }

  if (!city) {
    throw new Error('Параметр --city обязателен.');
  }

  const cities = city
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  if (cities.length === 0) {
    throw new Error('Необходимо указать хотя бы один город.');
  }

  if (!Number.isInteger(days) || days < 1 || days > 7) {
    throw new Error('Параметр --days должен быть целым числом от 1 до 7.');
  }

  return {
    cities,
    days,
    noCache
  };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));

  const results = await Promise.allSettled(
    options.cities.map((city) =>
      getWeatherForCity(city, options.days)
    )
  );

  results.forEach((result, index) => {
    const city = options.cities[index];

    if (result.status === 'fulfilled') {
      console.log(formatWeatherReport(result.value));
    } else {
      console.error(`Ошибка для города "${city}": ${result.reason.message}`);
    }
  });
}

try {
  await main();
} catch (error) {
  console.error(`Ошибка: ${error.message}`);
  process.exitCode = 1;
}