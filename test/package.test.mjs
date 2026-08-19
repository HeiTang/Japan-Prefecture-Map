import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';

const run = promisify(execFile);

test('installs the packed package and resolves its data and render entrypoints', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'japan-prefecture-map-'));

  try {
    await writeFile(join(directory, 'package.json'), '{"private":true,"type":"module"}\n');
    const cache = join(directory, '.npm-cache');
    await mkdir(cache);
    const { stdout } = await run('npm', ['pack', '--json', '--pack-destination', directory, '--cache', cache], {
      cwd: new URL('..', import.meta.url),
    });
    const [{ filename }] = JSON.parse(stdout);
    const tarball = join(directory, filename);

    await run('npm', ['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', '--cache', cache, tarball], {
      cwd: directory,
    });

    const packageJson = JSON.parse(await readFile(join(directory, 'node_modules/japan-prefecture-map/package.json'), 'utf8'));
    assert.equal(packageJson.name, 'japan-prefecture-map');
    // 從安裝後的目錄用「套件名稱」載入，才會真的走 exports 對外路徑
    const { stdout: exported } = await run(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import { prefectures } from 'japan-prefecture-map/data';
         import { mapStyles, renderMap } from 'japan-prefecture-map/render';
         const svg = renderMap({ '13': 4 }, 'zh-TW');
         console.log(JSON.stringify({
           prefectures: prefectures.length,
           labels: (svg.match(/<title>/g) ?? []).length,
           styled: mapStyles.includes('.japan-map'),
         }));`,
      ],
      { cwd: directory },
    );

    assert.deepEqual(JSON.parse(exported), { prefectures: 47, labels: 47, styled: true });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
