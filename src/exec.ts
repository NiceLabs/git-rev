import { execFileSync, ExecFileSyncOptionsWithStringEncoding } from "child_process";

export type ExecValue = (
    string |
    number |
    ExecValue[] |
    undefined |
    null |
    false |
    Record<string, boolean | undefined | null>
);

export function git(values: ExecValue[], cwd?: string) {
    const options: ExecFileSyncOptionsWithStringEncoding = {
        encoding: "utf-8",
        cwd,
        stdio: ["inherit", "pipe", "pipe"],
        shell: false,
        maxBuffer: 0xFFFF, // 65535 bytes
        timeout: 60000, // one minute
    };
    const output = execFileSync("git", execArgs(values), options);
    return output.trim();
}

function execArgs(...values: ExecValue[]): string[];
function execArgs(): string[] {
    let values: string[] = [];
    for (const value of Array.from(arguments)) {
        if (!value) {
            continue;
        } else if (Array.isArray(value) && value.length) {
            values = values.concat(execArgs.apply(null, value));
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
}
