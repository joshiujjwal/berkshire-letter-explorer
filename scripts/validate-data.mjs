import { readFile } from 'node:fs/promises';
import { validateLetters } from '../site/src/data.js';
import { validatePerformanceData } from '../site/src/performance.js';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const [sources, letters, performance] = await Promise.all([
  readJson('../site/data/sources.json'),
  readJson('../site/data/letters.json'),
  readJson('../site/data/performance.json'),
]);
const validatedLetters = validateLetters(letters);
const performanceRows = validatePerformanceData(performance);
const sourceYears = sources.letters.map((entry) => entry.year);
const letterYears = validatedLetters.map((entry) => entry.year);
const missingLetters = sourceYears.filter((year) => !letterYears.includes(year));
const extraLetters = letterYears.filter((year) => !sourceYears.includes(year));
if (missingLetters.length || extraLetters.length) {
  throw new Error(`Letter/source coverage mismatch. Missing: ${missingLetters.join(', ') || 'none'}. Extra: ${extraLetters.join(', ') || 'none'}.`);
}
for (const year of sourceYears) {
  if (!performanceRows.some((row) => row.year === year)) {
    throw new Error(`Missing performance row for ${year}`);
  }
}
console.log(`Validated ${validatedLetters.length} letters and ${performanceRows.length} performance rows.`);
