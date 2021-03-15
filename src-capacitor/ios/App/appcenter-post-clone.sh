#!/usr/bin/env bash

cd ../../..
npm install
npm install -g @quasar/cli
quasar build -m capacitor -T ios
# (quasar dev -m capacitor -T ios &) | sed -e '/Sync finished/q'; pkill -f quasar
