#!/bin/bash

rm -rf $PWD/dist
npx babel src --out-dir dist --ignore '**/*-integration.js' --source-maps inline
git reset
git add $PWD/dist
git commit -am 'Updating dist files' -n
