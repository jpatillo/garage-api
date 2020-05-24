#!/bin/bash

npm install
if pm2 pid garage ; then
    pm2 start bin/www --name garage --watch
else
    pm2 restart garage --watch
fi