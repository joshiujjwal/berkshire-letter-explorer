import { collectThemes, filterLetters, validateLetters } from './data.js';
import { calculateGrowthSeries, formatCurrency, formatPercent, validatePerformanceData } from './performance.js';
import { renderGrowthChart } from './chart.js';

const state = { letters: [], filtered: [], selectedYear: null, query: '', theme: '', performanceSeries: [] };
const $ = (selector) => document.querySelector(selector);
const el = (name, attrs = {}, children = []) => {
  const node = document.createElement(name);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') node.className = value;
    else node.setAttribute(key, String(value));
  }
  for (const child of children) node.append(child);
  return node;
};
const text = (value) => document.createTextNode(value);

const loadJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path}: HTTP ${response.status}`);
  }
  return response.json();
};

const parseHashYear = () => {
  const params = new URLSearchParams(location.hash.slice(1));
  const value = params.get('year');
  return value ? Number(value) : null;
};

const updateHash = (year) => {
  const next = new URLSearchParams(location.hash.slice(1));
  next.set('year', String(year));
  history.replaceState(null, '', `${location.pathname}${location.search}#${next.toString()}`);
};

const renderThemeOptions = () => {
  const select = $('#theme-filter');
  select.replaceChildren(el('option', { value: '' }, [text('All themes')]));
  for (const theme of collectThemes(state.letters)) {
    select.append(el('option', { value: theme }, [text(theme)]));
  }
};

const renderTimeline = () => {
  const list = $('#timeline');
  list.replaceChildren();
  if (!state.filtered.length) {
    list.append(el('p', { className: 'empty-state' }, [text('No letters match the current filters.')]));
    return;
  }
  for (const letter of state.filtered) {
    const button = el('button', { type: 'button', class: letter.year === state.selectedYear ? 'selected' : '' }, [text(String(letter.year))]);
    button.addEventListener('click', () => selectYear(letter.year));
    list.append(el('li', {}, [button]));
  }
};

const renderLetter = () => {
  const target = $('#letter-detail');
  const letter = state.letters.find((item) => item.year === state.selectedYear);
  target.replaceChildren();
  if (!letter) {
    target.append(el('p', { className: 'error' }, [text(`Year ${state.selectedYear} is not in the local dataset. Choose another year.`)]));
    return;
  }

  target.append(
    el('h3', {}, [text(letter.title)]),
    el('p', { className: 'meta' }, [text(`${letter.author} · ${letter.sourceType.toUpperCase()} source · ${letter.reviewStatus}`)]),
    el('p', {}, [text(letter.summary)]),
    el('h4', {}, [text('Three lessons')]),
    el('ol', {}, letter.lessons.map((lesson) => el('li', {}, [text(lesson)]))),
    el('h4', {}, [text('Themes')]),
    el('p', { className: 'chips' }, letter.themes.map((theme) => el('span', {}, [text(theme)]))),
    el('h4', {}, [text('Sources')]),
    el('ul', {}, letter.citations.map((citation) => {
      const link = el('a', { href: citation.url, target: '_blank', rel: 'noopener noreferrer' }, [text(citation.label)]);
      return el('li', {}, [link]);
    })),
  );
};

const renderPerformanceTable = () => {
  const body = $('#performance-table tbody');
  body.replaceChildren();
  for (const point of state.performanceSeries) {
    body.append(el('tr', {}, [
      el('td', {}, [text(String(point.year))]),
      el('td', {}, [text(formatPercent(point.berkshireMarketReturn))]),
      el('td', {}, [text(formatPercent(point.sp500WithDividendsReturn))]),
      el('td', {}, [text(formatCurrency(point.berkshireValue))]),
      el('td', {}, [text(formatCurrency(point.sp500Value))]),
    ]));
  }
};

const applyFilters = () => {
  state.filtered = filterLetters(state.letters, { query: state.query, theme: state.theme });
  if (state.filtered.length && !state.filtered.some((letter) => letter.year === state.selectedYear)) {
    state.selectedYear = state.filtered.at(-1).year;
    updateHash(state.selectedYear);
  }
  renderTimeline();
  renderLetter();
};

const selectYear = (year) => {
  state.selectedYear = year;
  updateHash(year);
  renderTimeline();
  renderLetter();
};

const start = async () => {
  try {
    const [lettersRaw, performance] = await Promise.all([loadJson('./data/letters.json'), loadJson('./data/performance.json')]);
    state.letters = validateLetters(lettersRaw).sort((a, b) => a.year - b.year);
    const rows = validatePerformanceData(performance);
    state.performanceSeries = calculateGrowthSeries(rows);
    const hashedYear = parseHashYear();
    state.selectedYear = state.letters.some((letter) => letter.year === hashedYear) ? hashedYear : state.letters.at(-1).year;
    if (hashedYear !== null && hashedYear !== state.selectedYear) {
      $('#status').textContent = `Year ${hashedYear} is not available. Showing ${state.selectedYear}.`;
    }
    $('#search').addEventListener('input', (event) => { state.query = event.target.value; applyFilters(); });
    $('#theme-filter').addEventListener('change', (event) => { state.theme = event.target.value; applyFilters(); });
    renderThemeOptions();
    applyFilters();
    renderGrowthChart($('#chart'), state.performanceSeries);
    renderPerformanceTable();
  } catch (error) {
    $('#status').textContent = error.message;
    $('#status').classList.add('error');
  }
};

start();
