import { basename } from "path";
import { ExecValue, GitBase } from "./git-base";

export class Git extends GitBase {
    public constructor(cwd?: string) {
        super(cwd);
    }

    public getTopLevel() {
        return this.git("rev-parse", "--show-toplevel");
    }

    public branchName(rev = "HEAD") {
        return this.git("rev-parse", "--abbrev-ref", rev);
    }

    public commitHash(short = false, rev = "HEAD") {
        return this.git("rev-parse", { "--short": short }, rev);
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

    public tag(options?: ITagOptions) {
        return this.describe(
            "--always", "--tag", "--abbrev=0",
            { "--dirty": options?.markDirty, "--first-parent": options?.firstParent },
            options?.match && ["--match", options?.match],
        );
    }

    public log(fields?: Record<string, string>): Array<Record<string, string>>;
    public log(fields?: string[]): string[][];
    public log(fields?: any) {
        if (fields === undefined) {
            fields = { hash: "%H", date: "%s", subject: "%cI", name: "%an" };
        }
        const pretty = `--pretty=format:${JSON.stringify(fields)}`;
        const result = this.git("log", "--abbrev-commit", pretty);
        return JSON.parse(`[${result.replace(/\n/g, ",")}]`);
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
        const localHash = this.commitHash();
        const remoteHash = this.git("rev-parse", `${remoteName}/${branchName}`);
        return localHash === remoteHash;
    }

    public repositoryName(remoteName = "origin") {
        const url = this.remoteURL(remoteName);
        return basename(url, ".git");
    }
}

export interface ITagOptions  {
    markDirty?: boolean;
    firstParent?: boolean;
    match?: string;
}
