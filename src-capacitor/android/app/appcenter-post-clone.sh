#!/usr/bin/env bash

git_root=$(git rev-parse --show-toplevel)
cd $git_root
npm install
npm install -g @quasar/cli
quasar build -m capacitor -T android || true
