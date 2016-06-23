#!/bin/sh
rm ./kibana.json
elasticdump --input=http://192.168.99.100:9200/.kibana --output=./kibana.json --searchBody='
{
  "query": {
    "wildcard": 
      { "title": {"value": "default*"} }
  }
        
}' 
