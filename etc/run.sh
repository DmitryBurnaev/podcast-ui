#!/usr/bin/env sh

export NVM_DIR="$HOME/.nvm"

nvm use 18
export $(cat .env | grep -v ^# | xargs)
yarn serve --host ${HOST} --port ${PORT}
