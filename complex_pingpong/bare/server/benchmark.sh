#!/bin/bash

echo $1_$(date +%s) | pbcopy
MSGS=$1 npm start | tee finelogs/$1_$(date +%s).txt
