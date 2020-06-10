#!/bin/bash

SELF_DIRECTORY="$(dirname ${0})"
FILE="${SELF_DIRECTORY}/style/templates/${1}/${1}.scss"

if test -f "$FILE"; then
  yarn clear dist/$1
  yarn build:webpack $1
else
  echo "Template $1 does not exists."
fi
