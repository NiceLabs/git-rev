import git from "../src";
import {Git} from "../src/git";

// tslint:disable:no-console
console.log("git.branchName() =>", git.branchName());
console.log("git.commitHash() =>", git.commitHash());
console.log("git.commitHash(true) =>", git.commitHash(true));
console.log("git.commitDate() =>", git.commitDate());
console.log("git.commitCount() =>", git.commitCount());
console.log("git.message() =>", git.message());
console.log("git.describe() =>", git.describe('--always'));
console.log("git.tag() =>", git.tag(true, true));
console.log("git.hasUnstagedChanges() =>", git.hasUnstagedChanges());
console.log("git.isDirty() =>", git.isDirty());
console.log("git.remoteURL() =>", git.remoteURL());
console.log("git.isTagDirty() =>", git.isTagDirty());
console.log("git.repositoryName() =>", git.repositoryName());
console.log("git.isUpdateToDate() =>", git.isUpdateToDate());
console.log("git.log() =>", git.log().slice(0, 3));

const currentBranch = git.branchName();
console.log("git.createRemoteBranch('testBranch') =>", git.createRemoteBranch('testBranch'));
console.log(`git.checkoutBranch('${currentBranch}') =>`, git.checkoutBranch(currentBranch));
console.log("git.deleteRemoteBranch('testBranch') =>", git.deleteRemoteBranch('testBranch'));
console.log("git.deleteBranch('testBranch') =>", git.deleteBranch('testBranch'));

git.setWorkingDirectory('./tempRepo')
console.log("git.createBranch('testBranch') =>", git.createBranch('testBranch'));
console.log("git.checkoutBranch('testBranch') =>", git.checkoutBranch('testBranch'));
console.log("git.checkoutBranch('testBranch') =>", git.checkoutBranch('testBranch'));
console.log("git.commit('testBranch') =>", git.commit('Commit made by test'));
console.log("git.log() =>", git.log().slice(0, 3));

console.log("git.createTag('test tag') =>", git.createTag('testTag'));
console.log("git.createTag('test tag') =>", git.tag() );

// tslint:enable:no-console
