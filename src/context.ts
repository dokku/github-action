// This file contains code adapted from the docker/buildx project (https://github.com/docker/buildx)
// under the Apache 2.0 License. Modifications have been made to adapt it for the Dokku deployment project,
// including changes in the handling of inputs and switching from yarn to npm.

import * as core from '@actions/core';

export interface Inputs {
  image: string;
  branch: string;
  ci_branch_name: string;
  ci_commit: string;
  command: string;
  deploy_docker_image: string;
  deploy_user_name: string;
  deploy_user_email: string;
  git_push_flags: string;
  git_remote_url: string;
  review_app_name: string;
  ssh_host_key: string;
  ssh_private_key: string;
  ssh_passphrase: string;
  trace: string;
}

export function getInputs(): Inputs {
  return {
    image: core.getInput('image') || 'dokku/ci-docker-image:0.13.1',
    branch: core.getInput('branch') || 'master',
    ci_branch_name: core.getInput('ci_branch_name') || '',
    ci_commit: core.getInput('ci_commit') || '',
    command: core.getInput('command') || 'deploy',
    deploy_docker_image: core.getInput('deploy_docker_image') || '',
    deploy_user_name: core.getInput('deploy_user_name') || '',
    deploy_user_email: core.getInput('deploy_user_email') || '',
    git_push_flags: core.getInput('git_push_flags') || '',
    git_remote_url: core.getInput('git_remote_url'),
    review_app_name: core.getInput('review_app_name') || '',
    ssh_host_key: core.getInput('ssh_host_key') || '',
    ssh_private_key: core.getInput('ssh_private_key'),
    ssh_passphrase: core.getInput('ssh_passphrase') || '',
    trace: core.getInput('trace') || ''
  };
}
