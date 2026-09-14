export function formatWeatherReport(weather) {
  const lines = [];

  lines.push('');
  lines.push(`Погода: ${weather.city}, ${weather.country}`);
  lines.push(
    `Координаты: ${weather.latitude}, ${weather.longitude}`
  );
  lines.push('');

  lines.push('Дата         Мин.       Макс.       Осадки');
  lines.push('---------------------------------------------');

  for (const day of weather.forecast) {
    const min = `${day.minTemperature} °C`;
    const max = `${day.maxTemperature} °C`;
    const precipitation = `${day.precipitation} мм`;

    lines.push(
      `${day.date}   ${min.padEnd(10)} ${max.padEnd(10)} ${precipitation}`
    );
  }

  return lines.join('\n');
}