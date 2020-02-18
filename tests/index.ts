import git from "../src";

// tslint:disable:no-console
console.log("git.branchName() =>", git.branchName());
console.log("git.commitHash() =>", git.commitHash());
console.log("git.commitHash(true) =>", git.commitHash(true));
console.log("git.commitDate() =>", git.commitDate());
console.log("git.commitCount() =>", git.commitCount());
console.log("git.message() =>", git.message());
console.log("git.describe() =>", git.describe());
console.log("git.tag() =>", git.tag(true, true));
console.log("git.hasUnstagedChanges() =>", git.hasUnstagedChanges());
console.log("git.isDirty() =>", git.isDirty());
console.log("git.remoteURL() =>", git.remoteURL());
console.log("git.isTagDirty() =>", git.isTagDirty());
console.log("git.repositoryName() =>", git.repositoryName());
console.log("git.isUpdateToDate() =>", git.isUpdateToDate());
console.log("git.log() =>", git.log().slice(0, 3));
// tslint:enable:no-console
