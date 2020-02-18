# @nice-labs/git-rev

![node version](https://img.shields.io/node/v/@nice-labs/git-rev)
[![npm module](https://img.shields.io/npm/v/@nice-labs/git-rev)](https://www.npmjs.com/package/@nice-labs/git-rev)

Synchronously get the current git commit hash, tag, count, branch or commit message.

Forked from [git-rev-sync-js](https://github.com/kurttheviking/git-rev-sync-js).

## usage

```typescript
import git from "@nice-labs/git-rev";

// short commit-hash
console.log(git.commitHash(true)); // 75bf4ee

// long commit-hash
console.log(git.commitHash()); // 75bf4eea9aa1a7fd6505d0d0aa43105feafa92ef

// branch name
console.log(git.branchName()); // master
```

## installation

```bash
npm install --save-dev @nice-labs/git-rev
```
