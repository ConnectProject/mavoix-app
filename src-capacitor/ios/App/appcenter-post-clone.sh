#!/usr/bin/env bash

cd ../../..
npm install
npm install -g @quasar/cli
perl -lpe 's|(?<=PARSE_URL=).*|https://ghfc17.hosting.pasteur.fr/parse|' .env.example > .env
echo "Generated .env file:"
cat .env
# quasar build -m capacitor -T ios
(quasar dev -m capacitor -T ios &) | sed -e '/Sync finished/q'; pkill -f quasar
