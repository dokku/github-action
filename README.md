# dokku github-action

Easily deploy an app to your Dokku Instance from GitHub

### Requirements

Please note that this action is compatible with `dokku >= 0.11.6`.

## Inputs

#### `deploy_branch`

__Optional__. The branch to be deployed when pushing to Dokku (default to `master`). Useful when a [custom deploy branch](http://dokku.viewdocs.io/dokku/deployment/methods/git/#changing-the-deploy-branch) is set on Dokku.

Example Value: `develop`

#### `remote_url`

**Required**. The dokku app's git repository url **(in SSH format)**.

Example Value: `ssh://dokku@dokku.myhost.ca:22/appname`

#### `ssh_host_key`

__Optional__. The results of running `ssh-keyscan -t rsa $HOST`. The github-action will otherwise generate this on the fly via `ssh-keyscan`.

Example Value:

```
# dokku.com:22 SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.1
dokku.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCvS+lK38EEMdHGb...
```

#### `ssh_private_key`

> :bulb: Tip : It is recommended to use [Encrypted Secrets](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets) to store sensitive information such as SSH Keys.

**Required**. A private ssh key that has push access to your Dokku instance.

Example Value:

```
-----BEGIN OPENSSH PRIVATE KEY-----
MIIEogIBAAKCAQEAjLdCs9kQkimyfOSa8IfXf4gmexWWv6o/IcjmfC6YD9LEC4He
qPPZtAKoonmd86k8jbrSbNZ/4OBelbYO0pmED90xyFRLlzLr/99ZcBtilQ33MNAh
...
SvhOFcCPizxFeuuJGYQhNlxVBWPj1Jl6ni6rBoHmbBhZCPCnhmenlBPVJcnUczyy
zrrvVLniH+UTjreQkhbFVqLPnL44+LIo30/oQJPISLxMYmZnuwudPN6O6ubyb8MK
-----END OPENSSH PRIVATE KEY-----

```

## Example usage

This action is particularly useful when triggered by new pushes:

```yml
name: 'Deploy to my Dokku instance'

on:
  push:
    branches:
    - master

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:

    - name: Cancel Previous Runs # Optional step
      uses: styfle/cancel-workflow-action@0.4.0
      with:
        access_token: ${{ github.token }}

    - name: Cloning repo # This step is required
      uses: actions/checkout@v2
      with:
        fetch-depth: 0 # This is required or you will get an error regarding shallow pushes from Dokku

    - name: Push to dokku
      uses: obrassard/action-dokku-deploy@v1.0.3
      with:
        deploy_branch: 'master'
        remote_url: 'ssh://dokku@dokku.myhost.ca:22/appname'
        ssh_host_key: ${{ secrets.SSH_HOST_KEY }}
        ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
```
