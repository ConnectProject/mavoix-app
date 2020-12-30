#!/usr/bin/env bash

cd ../../..
npm install
npm install -g @quasar/cli
quasar build -m capacitor -T ios || true
