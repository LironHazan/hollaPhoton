#!/bin/sh
set -v
set -e
set -x


cd /var
mkdir www
cd www
mkdir aura
cd aura
rm -r package
tar -xzf myPhoton-0.0.0.tgz