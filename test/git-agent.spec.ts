import { assert } from "chai";
import "mocha";

import { GitAgent } from "../src";
import { cloneBundle, mkdtemp, writeFile } from "./utils";

describe("git-agent", () => {
    let cwd: string;
    let git: GitAgent;

    before(() => {
        cwd = mkdtemp();
        cloneBundle(cwd);
        writeFile(cwd, "updated");
        git = new GitAgent(cwd);
    });

    it(".checkoutBranch('master')", () => {
        git.checkoutBranch("master");
    });

    it(".createBranch('sample')", () => {
        git.createBranch("sample");
    });

    it(".checkoutBranch('sample')", () => {
        git.checkoutBranch("sample");
    });

    it(".commit('Commit made by test')", () => {
        git.commit("Commit made by test");
    });

    it(".createTag('sample')", () => {
        const tagName = "sample";
        git.createTag(tagName);
        assert.equal(git.tag(), tagName);
    });

    it(".setField and .getField", () => {
        const name = "foo.bar";
        const value = "example";
        git.setField(name, value);
        assert.equal(git.getField(name), value);
    });
});
