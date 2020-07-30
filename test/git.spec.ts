import { assert } from "chai";
import "mocha";
import rimraf from "rimraf";

import { Git } from "../src";
import { BUNDLE, cloneBundle, mkdtemp, writeFile } from "./utils";

describe("git", () => {
  let git: Git;
  const commit1 = {
    message: "first commit",
    hash: "8069d4fe266d987af1f5260c66e88fcd062e4546",
    date: "2020-02-27T15:07:23.000Z",
  };
  const commit2 = {
    message: "second commit",
    hash: "1bdab56686ca40f923ae463d1c799d04eef7919d",
    date: "2020-02-28T07:54:36.000Z",
    name: "Septs",
    email: "github@septs.pw",
  };

  before(() => {
    const cwd = mkdtemp();
    cloneBundle(cwd);
    writeFile(cwd, "updated");
    git = new Git(cwd);
  });

  after(() => {
    rimraf.sync(git.cwd!);
  });

  it(".getTopLevel()", () => {
    assert.equal(git.getTopLevel(), git.cwd);
  });

  it(".branchName()", () => {
    assert.equal(git.branchName(), "master");
  });

  it(".commitHash()", () => {
    assert.equal(git.commitHash(), commit2.hash);
    assert.equal(git.commitHash(4), commit2.hash.slice(0, 4));
    assert.equal(git.commitHash(true), commit2.hash.slice(0, 7));

    assert.equal(git.commitHash(undefined, commit1.hash.slice(0, 4)), commit1.hash);
  });

  it(".commitDate()", () => {
    assert.equal(git.commitDate().toISOString(), commit2.date);
    assert.equal(git.commitDate(commit1.hash).toISOString(), commit1.date);
  });

  it(".commitCount()", () => {
    assert.equal(git.commitCount(), 2);
  });

  it(".message()", () => {
    assert.equal(git.message(), commit2.message);
    assert.equal(git.message(commit1.hash), commit1.message);
  });

  it(".describe()", () => {
    assert.equal(git.describe(), "v1.0.0-1-g1bdab56");
  });

  it(".tag()", () => {
    const tag = git.tag({
      firstParent: true,
      markDirty: true,
    });
    assert.equal(tag, "v1.0.0-dirty");
  });

  it(".log()", () => {
    assert.deepEqual(git.log("%H"), [commit2.hash, commit1.hash]);
  });

  it(".logN1(...)", () => {
    assert.equal(git.logN1("%s"), commit2.message); // subject
    assert.equal(git.logN1("%an"), commit2.name); // author name
    assert.equal(git.logN1("%ae"), commit2.email); // author email
  });

  it(".hasUnstagedChanges()", () => {
    assert.isTrue(git.hasUnstagedChanges());
  });

  it(".isDirty()", () => {
    assert.isTrue(git.isDirty());
    assert.isTrue(git.isDirty(commit1.hash));
  });

  it(".isTagDirty()", () => {
    assert.isTrue(git.isTagDirty());
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
