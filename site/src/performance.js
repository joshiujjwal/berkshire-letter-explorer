const requiredMetrics = {
  berkshire: 'perShareMarketValue',
  sp500: 'sp500WithDividends',
};

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

export const validatePerformanceData = (performance) => {
  if (performance?.metrics?.berkshire !== requiredMetrics.berkshire) {
    throw new Error('Berkshire metric must be per-share market value, not book value');
  }
  if (performance?.metrics?.sp500 !== requiredMetrics.sp500) {
    throw new Error('S&P 500 metric must include dividends');
  }
  if (!Array.isArray(performance.rows) || performance.rows.length === 0) {
    throw new Error('Performance rows are required');
  }

  let previousYear = null;
  const seen = new Set();
  return performance.rows.map((row) => {
    if (!Number.isInteger(row.year)) {
      throw new Error('Every performance row needs an integer year');
    }
    if (seen.has(row.year)) {
      throw new Error(`Duplicate performance row for ${row.year}`);
    }
    if (previousYear !== null && row.year !== previousYear + 1) {
      throw new Error(`Performance rows must be ordered and contiguous at ${row.year}`);
    }
    if (!isFiniteNumber(row.berkshireMarketReturn) || !isFiniteNumber(row.sp500WithDividendsReturn)) {
      throw new Error(`Performance returns for ${row.year} must be finite numbers`);
    }
    seen.add(row.year);
    previousYear = row.year;
    return Object.freeze({ ...row });
  });
};

export const calculateGrowthSeries = (rows, initialValue = 100) => {
  if (!isFiniteNumber(initialValue) || initialValue <= 0) {
    throw new Error('Initial value must be a positive finite number');
  }

  let berkshireValue = initialValue;
  let sp500Value = initialValue;
  return rows.map((row) => {
    if (!isFiniteNumber(row.berkshireMarketReturn) || !isFiniteNumber(row.sp500WithDividendsReturn)) {
      throw new Error(`Performance returns for ${row.year} must be finite numbers`);
    }
    berkshireValue *= 1 + row.berkshireMarketReturn / 100;
    sp500Value *= 1 + row.sp500WithDividendsReturn / 100;
    return Object.freeze({
      year: row.year,
      berkshireMarketReturn: row.berkshireMarketReturn,
      sp500WithDividendsReturn: row.sp500WithDividendsReturn,
      berkshireValue,
      sp500Value,
    });
  });
};

export const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
export const formatPercent = (value) => `${value.toFixed(1)}%`;
