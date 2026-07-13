import assert from 'node:assert/strict';
import test from 'node:test';

import { getJapanStats, levelLabels, locales, prefectures } from '../dist/data.js';

const heitangLevels = {
  '01': 4,
  '11': 3,
  '13': 4,
  '14': 3,
  '19': 4,
  '20': 4,
  '21': 1,
  '22': 1,
  '23': 1,
  '25': 2,
  '26': 4,
  '27': 5,
  '28': 4,
  '29': 3,
  '30': 3,
  '33': 4,
  '34': 3,
  '36': 4,
  '37': 4,
  '40': 4,
  '41': 3,
  '42': 3,
  '43': 4,
  '44': 3,
  '47': 4,
};

test('exports 47 unique prefectures and complete locale labels', () => {
  assert.equal(prefectures.length, 47);
  assert.equal(new Set(prefectures.map(prefecture => prefecture.code)).size, 47);
  for (const locale of locales) {
    assert.equal(levelLabels[locale].length, 6);
    assert.ok(prefectures.every(prefecture => prefecture.names[locale]));
  }
});

test('preserves the HeiTang map score and stats', () => {
  assert.deepEqual(getJapanStats(heitangLevels), {
    score: 82,
    total: 47,
    visited: 25,
    stayed: 13,
    lived: 1,
  });
});

test('rejects unknown prefectures and levels outside 0–5', () => {
  assert.throws(() => getJapanStats({ '48': 1 }), TypeError);
  assert.throws(() => getJapanStats({ '01': 6 }), TypeError);
  assert.throws(() => getJapanStats({ '01': 1.5 }), TypeError);
});
