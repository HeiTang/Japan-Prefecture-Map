import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';

const run = promisify(execFile);

test('installs the packed package and imports its data entrypoint', async () => {
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
    const data = await import(join(directory, 'node_modules/japan-prefecture-map/dist/data.js'));
    assert.equal(data.prefectures.length, 47);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
