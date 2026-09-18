import test from 'node:test';
import assert from 'node:assert/strict';
import { filterLetters, validateLetters } from '../site/src/data.js';

test('should require exactly three lessons and source citations for every letter', () => {
  const valid = [{ year: 1977, title: '1977 letter', summary: 'A.', lessons: ['a', 'b', 'c'], themes: ['capital allocation'], citations: [{ id: 'c1', label: '1977 letter', url: 'https://www.berkshirehathaway.com/letters/1977.html' }], indexUrl: 'https://www.berkshirehathaway.com/letters/1977.html', documentUrl: 'https://www.berkshirehathaway.com/letters/1977.html', sourceType: 'html', author: 'Warren E. Buffett', reviewStatus: 'reviewed' }];
  assert.equal(validateLetters(valid).length, 1);
  assert.throws(() => validateLetters([{ ...valid[0], lessons: ['only one'] }]), /exactly three/i);
  assert.throws(() => validateLetters([{ ...valid[0], citations: [] }]), /citation/i);
});

test('should combine search text and selected theme filters deterministically', () => {
  const letters = [
    { year: 1977, title: 'Textiles and insurance', summary: 'Insurance results were strong.', lessons: ['focus on returns', 'capital matters', 'insurance discipline'], themes: ['insurance'] },
    { year: 2024, title: 'Cash and patience', summary: 'Liquidity remained important.', lessons: ['stay patient', 'measure risk', 'protect owners'], themes: ['liquidity'] },
  ];

  assert.deepEqual(filterLetters(letters, { query: 'insurance', theme: 'insurance' }).map((letter) => letter.year), [1977]);
  assert.deepEqual(filterLetters(letters, { query: 'insurance', theme: 'liquidity' }), []);
  assert.deepEqual(filterLetters(letters, { query: '', theme: '' }).map((letter) => letter.year), [1977, 2024]);
});
