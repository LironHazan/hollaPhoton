#!/bin/sh
set -v
set -e
set -x


cd /var/www/aura
rm -r package
tar -xzf myPhoton-0.0.0.tgz