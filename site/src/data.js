const OFFICIAL_ORIGIN = 'https://www.berkshirehathaway.com';

const normalize = (value) => String(value ?? '').toLowerCase();
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

const assertOfficialUrl = (value, field, year) => {
  try {
    const url = new URL(value);
    if (url.origin !== OFFICIAL_ORIGIN || !url.pathname.startsWith('/letters/')) {
      throw new Error();
    }
  } catch {
    throw new Error(`${field} for ${year} must be an official Berkshire letters URL`);
  }
};

export const validateLetters = (letters) => {
  if (!Array.isArray(letters)) {
    throw new Error('Letters data must be an array');
  }

  const years = new Set();
  return letters.map((letter) => {
    if (!Number.isInteger(letter.year)) {
      throw new Error('Every letter needs an integer year');
    }
    if (years.has(letter.year)) {
      throw new Error(`Duplicate letter year ${letter.year}`);
    }
    years.add(letter.year);

    for (const field of ['title', 'summary', 'author', 'reviewStatus', 'indexUrl', 'documentUrl', 'sourceType']) {
      if (!hasText(letter[field])) {
        throw new Error(`${field} is required for ${letter.year}`);
      }
    }
    assertOfficialUrl(letter.indexUrl, 'indexUrl', letter.year);
    assertOfficialUrl(letter.documentUrl, 'documentUrl', letter.year);
    if (!['html', 'pdf'].includes(letter.sourceType)) {
      throw new Error(`sourceType for ${letter.year} must be html or pdf`);
    }
    if (!Array.isArray(letter.lessons) || letter.lessons.length !== 3 || letter.lessons.some((lesson) => !hasText(lesson))) {
      throw new Error(`Letter ${letter.year} must have exactly three lessons`);
    }
    if (!Array.isArray(letter.themes) || letter.themes.length === 0 || letter.themes.some((theme) => !hasText(theme))) {
      throw new Error(`Letter ${letter.year} must have at least one theme`);
    }
    if (!Array.isArray(letter.citations) || letter.citations.length === 0) {
      throw new Error(`Letter ${letter.year} must include at least one citation`);
    }
    for (const citation of letter.citations) {
      if (!hasText(citation.id) || !hasText(citation.label) || !hasText(citation.url)) {
        throw new Error(`Every citation for ${letter.year} needs id, label, and URL`);
      }
      assertOfficialUrl(citation.url, 'citation URL', letter.year);
    }
    if (letter.sourceType === 'pdf' && letter.documentUrl.endsWith(`/${letter.year}.html`)) {
      throw new Error(`PDF-source record for ${letter.year} must point to the actual PDF document`);
    }
    return Object.freeze({ ...letter });
  });
};

export const filterLetters = (letters, { query = '', theme = '' } = {}) => {
  const needle = normalize(query).trim();
  const selectedTheme = normalize(theme).trim();

  return letters.filter((letter) => {
    const matchesTheme = !selectedTheme || letter.themes.some((item) => normalize(item) === selectedTheme);
    const haystack = [letter.year, letter.title, letter.summary, ...(letter.lessons ?? []), ...(letter.themes ?? []), ...((letter.citations ?? []).map((citation) => citation.label))].join(' ');
    const matchesSearch = !needle || normalize(haystack).includes(needle);
    return matchesTheme && matchesSearch;
  });
};

export const collectThemes = (letters) => [...new Set(letters.flatMap((letter) => letter.themes))].sort((a, b) => a.localeCompare(b));
