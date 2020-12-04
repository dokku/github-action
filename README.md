# dokku github-action

Official Github Action for deploying apps to a Dokku installation

## Requirements

Please note that this action is compatible with `dokku >= 0.11.6`.

## Inputs

- `branch`: (__optional__) The branch to deploy when pushing to Dokku. Useful when a [custom deploy branch](http://dokku.viewdocs.io/dokku/deployment/methods/git/#changing-the-deploy-branch) is set on Dokku.
  - default: `master`
  - example value: `main`

- `ci_branch_name`: (__optional__) The branch name that triggered the deploy. Automatically detected from `GITHUB_REF`.
  - example value: `develop`

- `ci_commit`: (__optional__) The commit sha that will be pushed. Automatically detected from `GITHUB_SHA`.
  - example value: `0aa00d8dd7c971c121e3d1e471d0a35e1daf8abe`

- `command`: (__optional__) The command to run for the action.
  - default: deploy
  - valid values:
    - `deploy`
    - `review-apps:create`: Used to create a review app - via `dokku apps:clone` - based on the `appname` configured in the `git_remote_url`. If the review app already exists, this action will not recreate the app. In both cases, the current commit will be pushed to the review app.
    - `review-apps:destroy`: Destroys an existing review app.

- `git_push_flags`: (__optional__) A string containing a set of flags to set on push. This may be used to enable force pushes, or trigger verbose log output from git.
  - example value: `--force -vvv`

- `git_remote_url`: (**required**) The dokku app's git repository url **(in SSH format)**.
  - required: true
  - example value: `ssh://dokku@dokku.myhost.ca:22/appname`

- `review_app_name`: (__optional__) The name of the review app to create or destroy. Computed as `review-$APPNAME-$BRANCH_NAME` if not specified, where:
  ```text
  $APPNAME: The parsed app name from the `git_remote_url`
  $BRANCH_NAME: The inflected git branch name
  ```
  - example value: `review-appname`

- `ssh_host_key`: (__optional__) The results of running `ssh-keyscan -t rsa $HOST`. The github-action will otherwise generate this on the fly via `ssh-keyscan`.
  - example value:
    ```text
    # dokku.com:22 SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.1
    dokku.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCvS+lK38EEMdHGb...
    ```

- `ssh_private_key`: (**required**) A private ssh key that has push access to the Dokku instance.
  - tip: It is recommended to use [Encrypted Secrets](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets) to store sensitive information such as SSH Keys.
  - example value:
    ```text
    -----BEGIN OPENSSH PRIVATE KEY-----
    MIIEogIBAAKCAQEAjLdCs9kQkimyfOSa8IfXf4gmexWWv6o/IcjmfC6YD9LEC4He
    qPPZtAKoonmd86k8jbrSbNZ/4OBelbYO0pmED90xyFRLlzLr/99ZcBtilQ33MNAh
    ...
    SvhOFcCPizxFeuuJGYQhNlxVBWPj1Jl6ni6rBoHmbBhZCPCnhmenlBPVJcnUczyy
    zrrvVLniH+UTjreQkhbFVqLPnL44+LIo30/oQJPISLxMYmZnuwudPN6O6ubyb8MK
    -----END OPENSSH PRIVATE KEY-----
    ```

## Examples

All examples below are functionally complete and can be copy-pasted into a `.github/workflows/deploy.yaml` file, with some minor caveats:

- The `git_remote_url` should be changed to match the server and app.
- An [Encrypted Secret](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets) should be set on the Github repository with the name `SSH_PRIVATE_KEY` containing the contents of a private ssh key that has been added to the Dokku installation via the `dokku ssh-keys:add` command.
- As pushing a git repository from a shallow clone does not work, all repository checkous should use a `fetch-depth` of `0`. All examples below have this option set correctly.

For simplicity, each example is standalone, but may be combined as necessary to create the desired effect.

- [__Simple Example__](/example-workflows/simple.yml): Deploys a codebase on push or merge to master.
- [__Cancel previous runs on new push__](/example-workflows/cancel-previous-runs.yml): This workflow is particularly useful when triggered by new pushes, and utilizes a third-party action.
- [__Avoid SSH Host Keyscan__](/example-workflows/specify-ssh-host-key.yml): By default, this action will scan the host for it's SSH host key and use that value directly. This may not be desirable for security compliance reasons.

  The `SSH_HOST_KEY` value can be retrieved by calling `ssh-keyscan -t rsa $HOST`, where `$HOST` is the Dokku server's hostname.
- [__Specify a custom deploy branch__:](/example-workflows/custom-deploy-branch.yml) Certain Dokku installations may use custom deploy branches other than `master`. In the following example, we push to the `develop` branch.
- [__Verbose Push Logging__](/example-workflows/verbose-logging.yml): Verbose client-side logging may be enabled with this method. Note that this does not enable trace mode on the deploy, and simply tells the `git` client to enable verbose log output
- [__Force Pushing__](/example-workflows/force-push.yml): If the remote app has been previously pushed manually from a location other than CI, it may be necessary to enable force pushing to avoid git errors.
- [__Review Apps__](/example-workflows/review-app.yml): Handles creation and deletion of review apps through use of `dokku apps:clone` and `dokku apps:destroy`. Review apps are a great way to allow folks to preview pull request changes before they get merged to production.
