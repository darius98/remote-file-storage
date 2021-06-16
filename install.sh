#!/usr/bin/env sh

# Dependencies
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs supervisor
npm install

# Deployment stuff
mkdir -p /var/rfs/
mkdir -p /var/rfs/data
mkdir -p /var/rfs/logs
cp deploy_config.json /var/rfs/config.json
cp supervisor.conf /etc/supervisor/conf.d/rfs.conf
sudo supervisorctl reread
sudo supervisorctl update
