export $(cat .env | grep -v ^# | xargs)
yarn serve --host ${HOST} --port ${PORT}
