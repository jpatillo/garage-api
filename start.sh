#!/bin/bash

npm install
if pm2 pid garage ; then
    echo "Restarting garage app"
    pm2 restart garage --watch --time --update-env
else
    echo "Creating garage app"
    pm2 start bin/www --name garage --watch
fi
