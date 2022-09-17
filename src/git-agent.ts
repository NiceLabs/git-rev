import { Git } from './git';

export class GitAgent extends Git {
  public commit(message: string) {
    this.git('commit', '--no-gpg-sign', '-am', message);
  }

  public createTag(tag: string) {
    this.git('tag', tag);
  }

  public createBranch(name: string, remoteName?: string) {
    this.git('branch', name);
    if (remoteName) {
      const branch = this.branchName();
      this.checkoutBranch(name);
      this.push({
        track: true,
        verify: true,
        remoteName,
      });
      this.checkoutBranch(branch);
    }
  }

  public deleteBranch(name: string, remoteName?: string) {
    if (remoteName) {
      return this.git('push', remoteName, '--delete', name);
    }
    return this.git('branch', '--delete', name);
  }

  public checkoutBranch(name: string) {
    this.git('checkout', name);
  }

  public push(options?: PushOptions) {
    const opts = {
      '--force': options?.force ?? false,
      '--tags': options?.includeTags ?? false,
      '--no-verify': options?.verify ?? false,
    };
    const track = options?.track && [
      '--set-upstream',
      options?.remoteName ?? 'origin',
      this.branchName(),
    ];
    this.git('push', opts, track);
  }

  public getField(name: string) {
    return this.git('config', '--get', name);
  }

  public setField(name: string, value: string) {
    return this.git('config', name, value);
  }
}

export type PushOptions = {
  verify?: boolean;
  force?: boolean;
  includeTags?: boolean;
} & {
  verify?: boolean;
  force?: boolean;
  includeTags?: boolean;
  track: true;
  remoteName: string;
};
