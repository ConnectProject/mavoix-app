#!/usr/bin/env bash

git_root=$(git rev-parse --show-toplevel)
cd $git_root
npm install
npm install -g @quasar/cli
perl -lpe 's|(?<=PARSE_URL=).*|https://ghfc17.hosting.pasteur.fr/parse|' .env.example > .env
echo "Generated .env file:"
cat .env
quasar build -m capacitor -T android || true
