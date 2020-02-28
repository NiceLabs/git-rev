import { ExecValue, git } from "./exec";

export { ExecValue };

export class GitBase {
    public cwd: string | undefined;

    public constructor(cwd?: string) {
        this.cwd = cwd;
    }

    protected git(...values: ExecValue[]) {
        return git(values, this.cwd);
    }
}
