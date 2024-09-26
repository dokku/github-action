// This file contains code adapted from the docker/buildx project (https://github.com/docker/buildx)
// under the Apache 2.0 License. Modifications have been made to adapt it for the Dokku deployment project,
// including changes in the Docker command logic and switching from yarn to npm.

import * as context from './context';
import * as core from '@actions/core';
import {Docker} from '@docker/actions-toolkit/lib/docker/docker';
import * as actionsToolkit from '@docker/actions-toolkit';

actionsToolkit.run(async () => {
  const input: context.Inputs = context.getInputs();
  core.info(`Git Remote URL: ${input.git_remote_url}`);

  core.exportVariable('IMAGE', input.image);
  core.exportVariable('BRANCH', input.branch);
  core.exportVariable('CI_BRANCH_NAME', input.ci_branch_name);
  core.exportVariable('CI_COMMIT', input.ci_commit);
  core.exportVariable('COMMAND', input.command);
  core.exportVariable('DEPLOY_DOCKER_IMAGE', input.deploy_docker_image);
  core.exportVariable('DEPLOY_USER_NAME', input.deploy_user_name);
  core.exportVariable('DEPLOY_USER_EMAIL', input.deploy_user_email);
  core.exportVariable('GIT_PUSH_FLAGS', input.git_push_flags);
  core.exportVariable('GIT_REMOTE_URL', input.git_remote_url);
  core.exportVariable('REVIEW_APP_NAME', input.review_app_name);
  core.exportVariable('SSH_HOST_KEY', input.ssh_host_key);
  core.exportVariable('SSH_PRIVATE_KEY', input.ssh_private_key);
  core.exportVariable('SSH_PASSPHRASE', input.ssh_passphrase);
  core.exportVariable('TRACE', input.trace);

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
    await Docker.getExecOutput(
      [
        'run',
        '--rm',
        '-v',
        `${process.env.GITHUB_WORKSPACE}:/github/workspace`, // Monta el repositorio en /workspace
        '-w',
        '/github/workspace',
        '-e',
        `SSH_PRIVATE_KEY=${input.ssh_private_key}`,
        '-e',
        `GIT_REMOTE_URL=${input.git_remote_url}`,
        '-e',
        `BRANCH=${input.branch}`,
        '-e',
        `CI_BRANCH_NAME=${input.ci_branch_name}`,
        '-e',
        `CI_COMMIT=${input.ci_commit}`,
        '-e',
        `COMMAND=${input.command}`,
        '-e',
        `DEPLOY_DOCKER_IMAGE=${input.deploy_docker_image}`,
        '-e',
        `DEPLOY_USER_NAME=${input.deploy_user_name}`,
        '-e',
        `DEPLOY_USER_EMAIL=${input.deploy_user_email}`,
        '-e',
        `GIT_PUSH_FLAGS=${input.git_push_flags}`,
        '-e',
        `REVIEW_APP_NAME=${input.review_app_name}`,
        '-e',
        `SSH_HOST_KEY=${input.ssh_host_key}`,
        '-e',
        `SSH_PASSPHRASE=${input.ssh_passphrase}`,
        '-e',
        `TRACE=${input.trace}`,
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
});
