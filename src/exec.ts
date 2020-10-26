import { execFileSync } from 'child_process';

export type ExecValue =
  | string
  | number
  | ExecValue[]
  | undefined
  | null
  | false
  | Record<string, boolean | undefined | null>;

export const git = (values: ExecValue[], cwd?: string) =>
  execFileSync('git', Array.from(pattern(values)), {
    cwd,
    shell: false,
    stdio: ['inherit', 'pipe', 'pipe'],
    encoding: 'utf-8',
    maxBuffer: 0xffff, // 65535 bytes
    timeout: 60000, // one minute
    env: { LANG: 'en_US' },
  }).trim();

function* pattern(...rest: ExecValue[]): Iterable<string> {
  for (const value of rest) {
    if (!value) {
      continue;
    } else if (Array.isArray(value)) {
      yield* pattern(...value);
    } else if (typeof value === 'string' || typeof value === 'number') {
      yield String(value);
    } else if (typeof value === 'object') {
      for (const key of Object.keys(value)) {
        if (value[key]) {
          yield key;
        }
      }
    }
  }
}
