import { readFile } from 'node:fs/promises';
import https from 'node:https';

const sources = JSON.parse(await readFile(new URL('../site/data/sources.json', import.meta.url), 'utf8'));
const head = (url) => new Promise((resolve, reject) => {
  const request = https.request(url, { method: 'HEAD', timeout: 15000 }, (response) => {
    response.resume();
    resolve({ url, status: response.statusCode, type: response.headers['content-type'] ?? '' });
  });
  request.on('timeout', () => request.destroy(new Error(`Timeout: ${url}`)));
  request.on('error', reject);
  request.end();
});

for (const source of sources.letters) {
  const result = await head(source.documentUrl);
  console.log(`${source.year}\t${result.status}\t${result.type}\t${result.url}`);
  if (result.status === 403 || result.status === 429) {
    throw new Error(`Source audit blocked at ${source.year}; stop rather than probing repeatedly.`);
  }
  await new Promise((resolve) => setTimeout(resolve, 150));
}
