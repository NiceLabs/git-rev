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

function pattern(...rest: ExecValue[]) {
  let values: string[] = [];
  for (const value of rest) {
    if (!value) {
      continue;
    } else if (Array.isArray(value)) {
      values = values.concat(pattern(...value));
    } else if (typeof value === "string" || typeof value === "number") {
      values = values.concat([String(value)]);
    } else if (typeof value === "object") {
      values = values.concat(Object.keys(value).filter((key) => value[key]));
    }
  }
  return values;
}
