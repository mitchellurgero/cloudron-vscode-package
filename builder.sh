#!/bin/bash

## Build app
docker build -t mitchellurgero/org.urgero.vslamp:latest . --no-cache 
docker push mitchellurgero/org.urgero.vslamp:latest

## Install app
cloudron install --image=mitchellurgero/org.urgero.vslamp:latest
