import { ExecValue, git } from "./exec";

export { ExecValue };

export class GitBase {
    protected cwd: string | undefined;

    public constructor(cwd?: string) {
        this.cwd = cwd;
    }

    public setWorkingDirectory(cwd: string | undefined) {
        this.cwd = cwd;
    }

    protected git(...values: ExecValue[]) {
        return git(values, this.cwd);
    }
}
