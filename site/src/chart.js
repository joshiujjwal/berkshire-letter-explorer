const NS = 'http://www.w3.org/2000/svg';
const createSvg = (name, attributes = {}) => {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attributes)) {
    node.setAttribute(key, String(value));
  }
  return node;
};

export const renderGrowthChart = (container, series) => {
  container.replaceChildren();
  if (!series.length) {
    container.textContent = 'No performance data is available.';
    return;
  }

  const width = 920;
  const height = 420;
  const pad = { top: 24, right: 32, bottom: 48, left: 72 };
  const minYear = Math.min(...series.map((point) => point.year));
  const maxYear = Math.max(...series.map((point) => point.year));
  const maxValue = Math.max(...series.flatMap((point) => [point.berkshireValue, point.sp500Value]));
  const x = (year) => pad.left + ((year - minYear) / (maxYear - minYear || 1)) * (width - pad.left - pad.right);
  const y = (value) => height - pad.bottom - (value / maxValue) * (height - pad.top - pad.bottom);
  const toPath = (selector) => series.map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(point.year).toFixed(2)} ${y(selector(point)).toFixed(2)}`).join(' ');

  const svg = createSvg('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-labelledby': 'chart-title chart-desc' });
  svg.append(createSvg('title', { id: 'chart-title' })).textContent = 'Hypothetical growth of $100 invested at the start of 1977';
  svg.append(createSvg('desc', { id: 'chart-desc' })).textContent = 'Two line series compare Berkshire per-share market value changes with the S&P 500 including dividends.';

  svg.append(createSvg('line', { x1: pad.left, y1: pad.top, x2: pad.left, y2: height - pad.bottom, class: 'axis' }));
  svg.append(createSvg('line', { x1: pad.left, y1: height - pad.bottom, x2: width - pad.right, y2: height - pad.bottom, class: 'axis' }));
  for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
    const value = maxValue * fraction;
    const gridY = y(value);
    svg.append(createSvg('line', { x1: pad.left, y1: gridY, x2: width - pad.right, y2: gridY, class: 'grid' }));
    const label = createSvg('text', { x: 12, y: gridY + 4, class: 'axis-label' });
    label.textContent = `$${Math.round(value).toLocaleString()}`;
    svg.append(label);
  }
  for (const year of [minYear, 1985, 1995, 2005, 2015, maxYear]) {
    const label = createSvg('text', { x: x(year), y: height - 14, class: 'axis-label year-label' });
    label.textContent = year;
    svg.append(label);
  }

  svg.append(createSvg('path', { d: toPath((point) => point.berkshireValue), class: 'series berkshire' }));
  svg.append(createSvg('path', { d: toPath((point) => point.sp500Value), class: 'series sp500' }));
  container.append(svg);
};
