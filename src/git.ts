import { basename } from "path";
import { ExecValue, GitBase } from "./git-base";

export class Git extends GitBase {
  public constructor(cwd?: string) {
    super(cwd);
  }

  public getTopLevel() {
    return this.git("rev-parse", "--show-toplevel");
  }

  public isRepository() {
    try {
      this.getTopLevel();
    } catch {
      return false;
    }
    return true;
  }

  public branchName(rev = "HEAD") {
    return this.git("rev-parse", "--abbrev-ref", rev);
  }

  public commitHash(short: boolean | number = false, rev = "HEAD") {
    const makeShort = () => (typeof short === "number" && `--short=${short}`) || (short && "--short");
    return this.git("rev-parse", makeShort(), rev);
  }

  public commitDate(rev?: string) {
    return new Date(this.logN1("%aI", rev));
  }

  public commitCount() {
    return Number.parseInt(this.git("rev-list", "--all", "--count"), 10);
  }

  public message(rev?: string) {
    return this.logN1("%B", rev);
  }

  public describe(...values: ExecValue[]) {
    return this.git("describe", ...values);
  }

  public tag(options?: TagOptions) {
    return this.describe(
      "--always",
      "--tag",
      "--abbrev=0",
      { "--dirty": options?.markDirty, "--first-parent": options?.firstParent },
      options?.match && ["--match", options?.match]
    );
  }

  public log(fields?: Record<string, string>, n?: number): Record<string, string>[];
  public log(fields?: string[], n?: number): string[][];
  public log(fields?: string, n?: number): string[];
  public log(fields?: any, n?: number) {
    if (fields === undefined) {
      fields = { hash: "%H", date: "%s", subject: "%cI", name: "%an" };
    }
    const pretty = `--pretty=format:${JSON.stringify(fields)},`;
    const count = n && `--max-count=${n}`;
    const result = this.git("log", "--abbrev-commit", count, pretty);
    return JSON.parse(`[${result.slice(0, -1)}]`);
  }

  public logN1(format: string, rev = "HEAD"): string {
    const pretty = `--pretty=format:${format}`;
    return this.git("log", "-1", pretty, rev);
  }

  public remoteURL(name = "origin") {
    return this.git("remote", "get-url", name);
  }

  public hasUnstagedChanges() {
    return this.isDirty(this.git("write-tree"));
  }

  public isDirty(rev = "HEAD") {
    return this.git("diff-index", rev, "--").length > 0;
  }

  public isTagDirty() {
    try {
      this.describe("--exact-match", "--tags");
    } catch (err) {
      if (err.message.includes("no tag exactly matches")) {
        return true;
      }
      throw err;
    }
    return false;
  }

  public isUpdateToDate(branchName = this.branchName(), remoteName = "origin") {
    this.git("fetch", remoteName, branchName);
    return this.commitHash(false, "HEAD") === this.commitHash(false, `${remoteName}/${branchName}`);
  }

  public repositoryName(remoteName = "origin") {
    const url = this.remoteURL(remoteName);
    return basename(url, ".git");
  }
}

export interface TagOptions {
  markDirty?: boolean;
  firstParent?: boolean;
  match?: string;
}
