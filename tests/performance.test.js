import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateGrowthSeries, validatePerformanceData } from '../site/src/performance.js';

test('should calculate growth multiplicatively from $100 before applying the 1977 return', () => {
  const result = calculateGrowthSeries([
    { year: 1977, berkshireMarketReturn: 46.8, sp500WithDividendsReturn: -7.4 },
  ]);

  assert.equal(result[0].year, 1977);
  assert.equal(result[0].berkshireValue, 146.8);
  assert.equal(result[0].sp500Value, 92.6);
});

test('should reject duplicate, unsorted, missing, invalid, and book-value performance rows', () => {
  assert.throws(() => validatePerformanceData({ metrics: { berkshire: 'bookValue' }, rows: [] }), /market value/i);
  assert.throws(() => validatePerformanceData({ metrics: { berkshire: 'perShareMarketValue', sp500: 'sp500WithDividends' }, rows: [{ year: 1978, berkshireMarketReturn: 1, sp500WithDividendsReturn: 1 }, { year: 1977, berkshireMarketReturn: 1, sp500WithDividendsReturn: 1 }] }), /ordered/i);
  assert.throws(() => validatePerformanceData({ metrics: { berkshire: 'perShareMarketValue', sp500: 'sp500WithDividends' }, rows: [{ year: 1977, berkshireMarketReturn: 1, sp500WithDividendsReturn: 1 }, { year: 1977, berkshireMarketReturn: 2, sp500WithDividendsReturn: 2 }] }), /duplicate/i);
  assert.throws(() => validatePerformanceData({ metrics: { berkshire: 'perShareMarketValue', sp500: 'sp500WithDividends' }, rows: [{ year: 1977, berkshireMarketReturn: Number.NaN, sp500WithDividendsReturn: 1 }] }), /finite/i);
  assert.throws(() => validatePerformanceData({ metrics: { berkshire: 'perShareMarketValue', sp500: 'sp500WithDividends' }, rows: [{ year: 1977, berkshireMarketReturn: 1 }] }), /finite/i);
});
