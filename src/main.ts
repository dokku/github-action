// This file contains code adapted from the docker/buildx project (https://github.com/docker/buildx)
// under the Apache 2.0 License. Modifications have been made to adapt it for the Dokku deployment project,
// including changes in the Docker command logic and switching from yarn to npm.

import * as context from './context';
import * as core from '@actions/core';
import { Docker } from '@docker/actions-toolkit/lib/docker/docker';
import * as actionsToolkit from '@docker/actions-toolkit';

actionsToolkit.run(
  // main
  async () => {
    const input: context.Inputs = context.getInputs();

    await core.group(`Docker info`, async () => {
      await Docker.printVersion();
      await Docker.printInfo();
    });

    await core.group(`Pulling Docker image for deployment`, async () => {
      await Docker.getExecOutput(['pull', input.image], {
        ignoreReturnCode: true
      }).then(res => {
        if (res.stderr.length > 0 && res.exitCode != 0) {
          throw new Error(res.stderr.match(/(.*)\s*$/)?.[0]?.trim() ?? 'unknown error');
        }
      });
    });

    await core.group(`Deploying the app`, async () => {
      // Use the pulled image to execute Dokku commands
      await Docker.getExecOutput(
        [
          'run',
          '--rm',
          '-e',
          `SSH_PRIVATE_KEY=${input.ssh_private_key}`,
          input.image,
          'dokku-deploy',
          input.git_remote_url,
          input.branch
        ],
        {
          ignoreReturnCode: true
        }
      ).then(res => {
        if (res.stderr.length > 0 && res.exitCode != 0) {
          throw new Error(res.stderr.match(/(.*)\s*$/)?.[0]?.trim() ?? 'unknown error');
        }
      });
    });
  }
);
