#!/bin/sh

coffee -o ../js -c ../src/*
node ../js/app.js > /dev/null &
python test_get_set.py
killall node
