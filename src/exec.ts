import { execFileSync } from "child_process";

export type ExecValue = string | number | ExecValue[] | undefined | null | false | Record<string, boolean | undefined | null>;

export const git = (values: ExecValue[], cwd?: string) =>
  execFileSync("git", pattern(values), {
    cwd,
    shell: false,
    stdio: ["inherit", "pipe", "pipe"],
    encoding: "utf-8",
    maxBuffer: 0xffff, // 65535 bytes
    timeout: 60000, // one minute
  }).trim();

const pattern = (...rest: any[]): string[] => {
  let values: string[] = [];
  for (const value of rest) {
    if (!value) {
      continue;
    } else if (Array.isArray(value) && value.length) {
      values = values.concat(pattern(...value));
      continue;
    }
    switch (typeof value) {
      case "string":
      case "number":
        values = values.concat([String(value)]);
        continue;
      case "object":
        const keys = Object.keys(value);
        values = values.concat(keys.filter((key) => value[key]));
        continue;
    }
  }
  return values;
};
