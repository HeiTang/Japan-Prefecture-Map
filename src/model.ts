export const locales = ['zh-TW', 'ja', 'en'] as const;
export const themes = ['light', 'dark', 'auto'] as const;

export type JapanMapLocale = (typeof locales)[number];
export type JapanMapTheme = (typeof themes)[number];
export type PrefectureLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const prefectures = [
  { code: '01', names: { 'zh-TW': '北海道', ja: '北海道', en: 'Hokkaido' } },
  { code: '02', names: { 'zh-TW': '青森', ja: '青森', en: 'Aomori' } },
  { code: '03', names: { 'zh-TW': '岩手', ja: '岩手', en: 'Iwate' } },
  { code: '04', names: { 'zh-TW': '宮城', ja: '宮城', en: 'Miyagi' } },
  { code: '05', names: { 'zh-TW': '秋田', ja: '秋田', en: 'Akita' } },
  { code: '06', names: { 'zh-TW': '山形', ja: '山形', en: 'Yamagata' } },
  { code: '07', names: { 'zh-TW': '福島', ja: '福島', en: 'Fukushima' } },
  { code: '08', names: { 'zh-TW': '茨城', ja: '茨城', en: 'Ibaraki' } },
  { code: '09', names: { 'zh-TW': '栃木', ja: '栃木', en: 'Tochigi' } },
  { code: '10', names: { 'zh-TW': '群馬', ja: '群馬', en: 'Gunma' } },
  { code: '11', names: { 'zh-TW': '埼玉', ja: '埼玉', en: 'Saitama' } },
  { code: '12', names: { 'zh-TW': '千葉', ja: '千葉', en: 'Chiba' } },
  { code: '13', names: { 'zh-TW': '東京', ja: '東京', en: 'Tokyo' } },
  { code: '14', names: { 'zh-TW': '神奈川', ja: '神奈川', en: 'Kanagawa' } },
  { code: '15', names: { 'zh-TW': '新潟', ja: '新潟', en: 'Niigata' } },
  { code: '16', names: { 'zh-TW': '富山', ja: '富山', en: 'Toyama' } },
  { code: '17', names: { 'zh-TW': '石川', ja: '石川', en: 'Ishikawa' } },
  { code: '18', names: { 'zh-TW': '福井', ja: '福井', en: 'Fukui' } },
  { code: '19', names: { 'zh-TW': '山梨', ja: '山梨', en: 'Yamanashi' } },
  { code: '20', names: { 'zh-TW': '長野', ja: '長野', en: 'Nagano' } },
  { code: '21', names: { 'zh-TW': '岐阜', ja: '岐阜', en: 'Gifu' } },
  { code: '22', names: { 'zh-TW': '靜岡', ja: '静岡', en: 'Shizuoka' } },
  { code: '23', names: { 'zh-TW': '愛知', ja: '愛知', en: 'Aichi' } },
  { code: '24', names: { 'zh-TW': '三重', ja: '三重', en: 'Mie' } },
  { code: '25', names: { 'zh-TW': '滋賀', ja: '滋賀', en: 'Shiga' } },
  { code: '26', names: { 'zh-TW': '京都', ja: '京都', en: 'Kyoto' } },
  { code: '27', names: { 'zh-TW': '大阪', ja: '大阪', en: 'Osaka' } },
  { code: '28', names: { 'zh-TW': '兵庫', ja: '兵庫', en: 'Hyogo' } },
  { code: '29', names: { 'zh-TW': '奈良', ja: '奈良', en: 'Nara' } },
  { code: '30', names: { 'zh-TW': '和歌山', ja: '和歌山', en: 'Wakayama' } },
  { code: '31', names: { 'zh-TW': '鳥取', ja: '鳥取', en: 'Tottori' } },
  { code: '32', names: { 'zh-TW': '島根', ja: '島根', en: 'Shimane' } },
  { code: '33', names: { 'zh-TW': '岡山', ja: '岡山', en: 'Okayama' } },
  { code: '34', names: { 'zh-TW': '廣島', ja: '広島', en: 'Hiroshima' } },
  { code: '35', names: { 'zh-TW': '山口', ja: '山口', en: 'Yamaguchi' } },
  { code: '36', names: { 'zh-TW': '德島', ja: '徳島', en: 'Tokushima' } },
  { code: '37', names: { 'zh-TW': '香川', ja: '香川', en: 'Kagawa' } },
  { code: '38', names: { 'zh-TW': '愛媛', ja: '愛媛', en: 'Ehime' } },
  { code: '39', names: { 'zh-TW': '高知', ja: '高知', en: 'Kochi' } },
  { code: '40', names: { 'zh-TW': '福岡', ja: '福岡', en: 'Fukuoka' } },
  { code: '41', names: { 'zh-TW': '佐賀', ja: '佐賀', en: 'Saga' } },
  { code: '42', names: { 'zh-TW': '長崎', ja: '長崎', en: 'Nagasaki' } },
  { code: '43', names: { 'zh-TW': '熊本', ja: '熊本', en: 'Kumamoto' } },
  { code: '44', names: { 'zh-TW': '大分', ja: '大分', en: 'Oita' } },
  { code: '45', names: { 'zh-TW': '宮崎', ja: '宮崎', en: 'Miyazaki' } },
  { code: '46', names: { 'zh-TW': '鹿兒島', ja: '鹿児島', en: 'Kagoshima' } },
  { code: '47', names: { 'zh-TW': '沖繩', ja: '沖縄', en: 'Okinawa' } },
] as const;

export type PrefectureCode = (typeof prefectures)[number]['code'];
export type PrefectureLevels = Partial<Record<PrefectureCode, PrefectureLevel>>;

export const levelLabels = {
  'zh-TW': [
    { label: '未踏', description: '尚未到訪' },
    { label: '通過', description: '交通路過，未下車' },
    { label: '接地', description: '下車、轉乘或短暫休息' },
    { label: '到訪', description: '觀光或一日活動，未過夜' },
    { label: '住宿', description: '至少過夜一次' },
    { label: '居住', description: '曾長期生活或工作' },
  ],
  ja: [
    { label: '未踏', description: '訪れたことがない' },
    { label: '通過', description: '交通機関で通過し、降りていない' },
    { label: '接地', description: '降車、乗り換え、短時間の休憩' },
    { label: '訪問', description: '観光または日帰りで訪問' },
    { label: '宿泊', description: '1泊以上した' },
    { label: '居住', description: '生活または仕事で長期滞在した' },
  ],
  en: [
    { label: 'Never visited', description: 'Never visited' },
    { label: 'Passed through', description: 'Passed through without getting off' },
    { label: 'Stopped', description: 'Got off, transferred, or took a short break' },
    { label: 'Visited', description: 'Visited for sightseeing or a day trip' },
    { label: 'Stayed', description: 'Stayed at least one night' },
    { label: 'Lived', description: 'Lived or worked there long-term' },
  ],
} as const;

export const uiCopy = {
  'zh-TW': {
    title: '日本 47 都道府縣制縣圖',
    description: '各都道府縣依旅行經驗分為零至五級。',
    score: '制縣等級',
    visited: '已踏足',
    stayed: '住宿以上',
    lived: '居住',
    legend: '0–5 分級',
    method: '同一都道府縣只記最高等級。',
    error: 'levels 設定無效，請確認都道府縣代碼與等級。',
    source: '地圖來源',
  },
  ja: {
    title: '日本47都道府県 制県レベルマップ',
    description: '旅行経験に応じて各都道府県を0から5に分類した地図です。',
    score: '制県レベル',
    visited: '訪問済み',
    stayed: '宿泊以上',
    lived: '居住',
    legend: 'レベル 0–5',
    method: '各都道府県は最高レベルのみ記録します。',
    error: 'levels の設定が無効です。都道府県コードとレベルを確認してください。',
    source: '地図出典',
  },
  en: {
    title: 'Japan 47 Prefecture Travel Map',
    description: 'Each prefecture is rated from zero to five by travel experience.',
    score: 'Prefecture level',
    visited: 'Visited',
    stayed: 'Stayed',
    lived: 'Lived',
    legend: 'Levels 0–5',
    method: 'Only the highest level is recorded for each prefecture.',
    error: 'Invalid levels. Check the prefecture codes and level values.',
    source: 'Map source',
  },
} as const;

const prefectureCodes = new Set<string>(prefectures.map(prefecture => prefecture.code));
export const prefectureByCode = new Map(prefectures.map(prefecture => [prefecture.code, prefecture]));

if (prefectures.length !== 47 || prefectureCodes.size !== 47) {
  throw new Error('[japan-prefecture-map] prefectures must contain 47 unique codes');
}

export function isLocale(value: string | null): value is JapanMapLocale {
  return locales.includes(value as JapanMapLocale);
}

export function isTheme(value: string | null): value is JapanMapTheme {
  return themes.includes(value as JapanMapTheme);
}

export function validateLevels(input: unknown): PrefectureLevels {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('levels must be an object keyed by JIS prefecture code');
  }

  const levels: PrefectureLevels = {};

  for (const [code, level] of Object.entries(input)) {
    if (!prefectureCodes.has(code) || !Number.isInteger(level) || Number(level) < 0 || Number(level) > 5) {
      throw new TypeError(`invalid prefecture level: ${code}=${String(level)}`);
    }
    levels[code as PrefectureCode] = level as PrefectureLevel;
  }

  return levels;
}

export function getJapanStats(input: PrefectureLevels) {
  const levels = validateLevels(input);
  const values = prefectures.map(prefecture => levels[prefecture.code] ?? 0);

  return {
    score: values.reduce<number>((total, level) => total + level, 0),
    total: prefectures.length,
    visited: values.filter(level => level > 0).length,
    stayed: values.filter(level => level >= 4).length,
    lived: values.filter(level => level === 5).length,
  };
}

export function sparseLevels(input: PrefectureLevels): PrefectureLevels {
  const levels = validateLevels(input);
  return Object.fromEntries(Object.entries(levels).filter(([, level]) => level !== 0)) as PrefectureLevels;
}
