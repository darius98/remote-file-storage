#!/usr/bin/env sh

IP=$1

ssh root@$IP "rm -r /home/rfs/; mkdir -p /home/rfs"
scp * root@$IP:/home/rfs/
ssh root@$IP "cd /home/rfs/; ./install.sh"
