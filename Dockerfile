#FROM harbor.sistemasmas.cl/mirror-docker-hub/dokku/ci-docker-image:0.13.0
ARG REGISTRY_MIRRORS=${registry_mirrors}
#FROM harbor.sistemasmas.cl/dokku-github-actions/ci-docker-image:0.13.0
FROM ${REGISTRY_MIRRORS}dokku-github-actions/ci-docker-image:0.13.0
