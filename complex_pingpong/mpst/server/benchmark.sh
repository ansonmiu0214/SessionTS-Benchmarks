#!/bin/bash

TIMESTAMP=$(date +%s)
echo $1_${TIMESTAMP} | pbcopy
MSGS=$1 npm start | tee finelogs/$1_${TIMESTAMP}.txt
