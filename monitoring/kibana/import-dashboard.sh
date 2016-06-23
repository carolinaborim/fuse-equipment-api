#!/bin/sh
elasticdump --output=http://192.168.99.100:9200/.kibana --input=./monitoring/kibana/dashboard.json
