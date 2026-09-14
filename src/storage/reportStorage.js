import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function sanitizeFileName(name) {
  return name.replace(/[\\/:*?"<>|]/g, '_').trim();
}

export function getCurrentDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getReportPath(city, reportsDir) {
  const safeCity = sanitizeFileName(city);
  const date = getCurrentDate();

  return path.join(
    reportsDir,
    `${safeCity}-${date}.json`
  );
}

export async function saveReport(
  city,
  report,
  reportsDir
) {
  await mkdir(reportsDir, {
    recursive: true
  });

  const filePath = getReportPath(city, reportsDir);

  await writeFile(
    filePath,
    JSON.stringify(report, null, 2),
    'utf-8'
  );

  return filePath;
}

export async function loadReport(
  city,
  reportsDir
) {
  const filePath = getReportPath(city, reportsDir);

  try {
    const content = await readFile(
      filePath,
      'utf-8'
    );

    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}