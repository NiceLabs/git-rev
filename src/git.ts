import { execFileSync, ExecFileSyncOptionsWithStringEncoding } from "child_process";
import { basename } from "path";

export class Git {
    private cwd: string | undefined;

    public constructor(cwd?: string) {
        this.cwd = cwd;
    }

    public setWorkingDirectory(cwd: string | undefined) {
        this.cwd = cwd;
    }

    protected git(...args: string[]) {
        const options: ExecFileSyncOptionsWithStringEncoding = {
            encoding: "utf-8",
            cwd: this.cwd,
            stdio: ["inherit", "pipe", "pipe"],
            shell: false,
        }
        const output = execFileSync(
            "git",
            args.filter((item) => typeof item === "string"),
            options,
        );
        return output.trim();
    }

    public getTopLevel() {
        return this.git("rev-parse", "--show-toplevel");
    }

    public branchName(rev = "HEAD") {
        return this.git("rev-parse", "--abbrev-ref", rev);
    }

    public commitHash(short = false, rev = "HEAD") {
        return this.git("rev-parse", short && "--short", rev);
    }

    public commitDate() {
        return new Date(this.logN1("%aI"));
    }

    public commitCount() {
        return Number.parseInt(this.git("rev-list", "--all", "--count"), 10);
    }

    public message() {
        return this.logN1("%B");
    }

    public describe(...args: string[]) {
        return this.git("describe", ...args);
    }

    public getField(name: string) {
        return this.git("config", "--get", name);
    }

    public setField(name: string, value: string) {
        return this.git("config", name, value);
    }

    public tag(markDirty = false, firstParent = false) {
        return this.describe(
            "--always", "--tag", "--abbrev=0",
            markDirty && "--dirty",
            firstParent && "--first-parent"
        );
    }

    public log(fields?: Record<string, string>): Record<string, string>[]
    public log(fields?: string[]): string[][]
    public log(fields?: any) {
        if (fields === undefined) {
            fields = { hash: "%H", date: "%s", subject: "%cI", name: "%an" };
        }
        const result = this.git(
            "log",
            "--abbrev-commit",
            `--pretty=format:${JSON.stringify(fields)}`,
        );
        return JSON.parse(`[${result.replace(/\n/g, ",")}]`);
    }

    public logN1(format: string) {
        return this.git("log", "-1", `--pretty=format:${format}`);
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
