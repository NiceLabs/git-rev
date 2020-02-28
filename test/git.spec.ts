import { assert } from "chai";
import "mocha";

import { Git } from "../src";
import { BUNDLE, cloneBundle, mkdtemp, writeFile } from "./utils";

describe("git", () => {
    let cwd: string;
    let git: Git;
    const hash = "8069d4fe266d987af1f5260c66e88fcd062e4546";

    before(() => {
        cwd = mkdtemp();
        cloneBundle(cwd);
        writeFile(cwd, "updated");
        git = new Git(cwd);
    });

    it(".getTopLevel()", () => {
        assert.equal(git.getTopLevel(), cwd);
    });

    it(".branchName()", () => {
        assert.equal(git.branchName(), "master");
    });

    it(".commitHash()", () => {
        assert.equal(git.commitHash(), hash);
        assert.equal(git.commitHash(4), hash.slice(0, 4));
        assert.equal(git.commitHash(true), hash.slice(0, 7));
    });

    it(".commitDate()", () => {
        const date = "2020-02-27T15:07:23.000Z";
        assert.equal(git.commitDate().toISOString(), date);
        assert.equal(git.commitDate(hash).toISOString(), date);
    });

    it(".commitCount()", () => {
        assert.equal(git.commitCount(), 1);
    });

    it(".message()", () => {
        assert.equal(git.message(), "first commit");
        assert.equal(git.message(hash), "first commit");
    });

    it(".describe()", () => {
        assert.equal(git.describe(), "v1.0.0");
    });

    it(".tag()", () => {
        const tag = git.tag({
            firstParent: true,
            markDirty: true,
        });
        assert.equal(tag, "v1.0.0-dirty");
    });

    it(".log()", () => {
        assert.deepEqual(git.log("%H"), [hash]);
    });

    it(".logN1(...)", () => {
        assert.equal(git.logN1("%s"), "first commit"); // subject
        assert.equal(git.logN1("%an"), "Septs"); // author name
        assert.equal(git.logN1("%ae"), "github@septs.pw"); // author email
    });

    it(".hasUnstagedChanges()", () => {
        assert.isTrue(git.hasUnstagedChanges());
    });

    it(".isDirty()", () => {
        assert.isTrue(git.isDirty());
        assert.isTrue(git.isDirty(hash));
    });

    it(".isTagDirty()", () => {
        assert.isFalse(git.isTagDirty());
    });

    it(".isUpdateToDate()", () => {
        assert.isTrue(git.isUpdateToDate());
    });

    it(".remoteURL()", () => {
        assert.equal(git.remoteURL(), BUNDLE);
    });

    it(".repositoryName()", () => {
        assert.equal(git.repositoryName(), "sample.bundle");
    });
});
