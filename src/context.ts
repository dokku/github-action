// This file contains code adapted from the docker/buildx project (https://github.com/docker/buildx)
// under the Apache 2.0 License. Modifications have been made to adapt it for the Dokku deployment project,
// including changes in the handling of inputs and switching from yarn to npm.

import * as core from '@actions/core';

export interface Inputs {
  image: string;
  branch: string;
  ssh_private_key: string;
  git_remote_url: string;
}

export function getInputs(): Inputs {
  return {
    image: core.getInput('image') || 'dokku/ci-docker-image:0.13.1',
    branch: core.getInput('branch') || 'master',
    ssh_private_key: core.getInput('ssh_private_key'),
    git_remote_url: core.getInput('git_remote_url')
  };
}
