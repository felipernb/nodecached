#!/bin/sh

coffee -o ../js -c ../src/*
node ../js/app.js > server.log &
python test_get_set_delete.py
killall node
