#!/bin/sh
rm ./monitoring/kibana/dashboard.json
elasticdump --input=http://192.168.99.100:9200/.kibana --output=./monitoring/kibana/dashboard.json --searchBody='
{
  "query": {
    "wildcard": 
      { "title": {"value": "default*"} }
  }
        
}' 
