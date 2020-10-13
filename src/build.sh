#!/bin/bash

SELF_DIRECTORY="$(dirname ${0})"
FILE="${SELF_DIRECTORY}/style/templates/${1}/${1}.scss"

if test -f "$FILE"; then
  yarn clear dist/$1
  yarn build:webpack $1
  yarn clear src/js/ts/colors.ts
  TEMPLATE=$1 node src/js/colors-module-factory.js
  yarn build:tsc
  cp ./src/js/ts-built/* ./dist/$1
  yarn clear src/js/ts-built
else
  echo "Template $1 does not exists."
fi
