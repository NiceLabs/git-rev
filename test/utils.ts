import fs from "fs";
import os from "os";
import path from "path";

import { git } from "../src/exec";

export const BUNDLE = path.join(__dirname, "sample.bundle");

export function mkdtemp() {
  const target = process.env.CI ? path.join(process.env.HOME, os.tmpdir()) : fs.realpathSync(os.tmpdir());
  return fs.mkdtempSync(target);
}

export function cloneBundle(cwd: string) {
  git(["clone", BUNDLE, cwd]);
}

export function writeFile(cwd: string, payload: string) {
  const target = path.join(cwd, "sample.txt");
  fs.writeFileSync(target, payload, "utf-8");
}
