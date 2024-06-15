#!/bin/bash

package="Kateru Riyu Docker Compose Runner Manager."
environment=""
docker_file=""

function display_help() {
    echo "${package}"
    echo "."
    echo "Usage : "
    echo "  ./riyu [environment]"
    echo "."
    echo "Environment:"
    echo "  local   : local server. use this if you running on local."
    echo "  staging : staging server. use this if you running on staging."
    echo "."
    echo "Example:"
    echo "  ./riyu local"
    echo "  ./riyu staging"

    exit 0
}

function get_docker_file() {
  if [[ $1 == "local" ]]; then
    docker_file=./.docker/compose/local/docker-compose.yml
  elif [[ $1 == "staging" ]]; then
    docker_file=./.docker/compose/staging/docker-compose.yml
  else
    echo "invalid environment type or this environment isn't supported."
    exit 0
  fi
  return
}

function docker_container_handler() {
    get_docker_file "${environment}"

    echo "Building docker compose with environment: ${environment}"
    echo "Using docker file: ${docker_file}"

    docker compose --env-file=.env --file="${docker_file}" up -d --build

    exit 0
}


if [[ $# -eq 0 ]]; then
    display_help
    exit 0
fi

if [[ $# -eq 1 ]]; then
    environment=$1
    docker_container_handler "${environment}"
fi


docker_container_handler "${environment}"