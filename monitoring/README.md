# Monitoring

This repository contains a set of configurations for monitoring APIs. It
was created as a result of a proof of concept from the [API
Platform team](https://confluence.agcocorp.com/display/AP/API+Platform).

The team evaluated several different monitoring stacks available as of
June 2016 and decided to use ELK (Elasticsearch + Logstash + Kibana) as the
__de facto__ monitoring solution.

More details on the evaluated tools as well on ELK can be found under
[Monitoring Tools](https://confluence.agcocorp.com/display/AP/Monitoring+Tools).

## Requirements

* [Virtualbox](https://www.virtualbox.org/)
* [Docker](https://docs.docker.com/engine/installation)
* [Docker Compose](https://docs.docker.com/compose/install)

## Running it

```shell
$ docker-compose up
```

The components are going to be available at:
* Logstash: `http://DOCKER_MACHINE_IP:5000`
* Elasticsearch: `http://DOCKER_MACHINE_IP:9200`
* Kibana: `http://DOCKER_MACHINE_IP:5601`

## Directory structure explained

```
  ├── docker-compose.yml
  ├── filebeat
  │   └── filebeat.yml
  ├── jmeter
  │   └── monitoring-load.jmx
  ├── log
  │   ├── empty
  └── logstash
  │   ├── logstash.conf
  │   └── template.json
```

* docker-compose.yml - Docker Compose configuration file
* /filebeat
  *  filebeat.yml - [Filebeat](https://www.elastic.co/guide/en/beats/filebeat/current/configuration-filebeat-options.html) configuration file, passed as volume to
     Filebeat container
* /jmeter
  * monitoring-load.jmx - Apache Jmeter exported configuration
* /log - Folder that Filebeat watches, .log files should be generated
  here
  * empty - Empty file just to make sure git tracks this directory
* /logstash - This entire folder is passed as volume to Logstash
  container
  * logstash.conf - [Logstash](https://www.elastic.co/guide/en/logstash/current/config-examples.html) configuration file
  * template.json - Elasticsearch index template

## The ELK stack

The ELK stack consists of three very popular technologies:
* [Elasticsearch](https://www.elastic.co/products/elasticsearch)
* [Logstash](https://www.elastic.co/products/logstash)
* [Kibana](https://www.elastic.co/products/kibana)

This stack allows us to create a __monitoring pipeline__ to collect, aggregate
and visualize business, as well as technical, metrics.

For example, lets say you want to know the response time for each one of your
API endpoints:
* Logstash will take in input data, filter, process and send it to
Elasticsearch.
* Elasticsearch will store and index your data to simplify its visualization
through Kibana reports.
* Kibana will generate different types of reports on top of your data.

### Filebeat

Filebeat is a mechanism for collecting logs on servers and send them to
Logstash for further parsing.

### Logstash

Logstash parses application logs and exports it to Elasticsearch.

Logstash expects your application logs and business metrics to be a
valid JSON document.

Our monitoring stack currently assumes you are using
[Bunyan](https://github.com/trentm/node-bunyan) JSON logging format, which is
looks like:

```js
{
  "name":"fuse-equipment-api",
  "hostname":"LAasivole",
  "pid":22149,
  "level":30,
  "path":"/equipment",
  "method":"get",
  "statusCode":200,
  "clientID":"b694eb03-d732-4916-b172-6f72b5421130",
  "username":"developerapi.seeder@fuseserviceaccount.com",
  "metric":10725,
  "metricUnit":"miliseconds",
  "description":"Response time in miliseconds",
  "tags":["response-time","equipment-facade"],
  "type":"metrics",
  "msg":"",
  "time":"2016-06-21T18:48:43.977Z","v":0
}
```

The `name` and `type` keys in this object will be used to specify where to
store metrics on Elasticsearch. The metrics are going to be stored using
the following pattern: `{name}-{YYYY.MM.DD}/{type}. For this example, metric
data will be available at:
`http://ELASTIC_SEARCH_URL/fuse-equipment-api-2016.06.21/metrics`.

### ElasticSearch

Elasticsearch is responsible for storing metrics data.

Elasticsearch will store metrics' data under an index such as
`fuse-equipment-api-2016.06.27`, for instance. Your application is
reponsible for letting the monitoring stack know what are the application
name as well as metric type.

This means that metrics are going to be rotated daily. In case you want
consolidated data for a greater period of time it just a matter of including
a wider set of indexes. This also makes it easy to remove old metrics from
our data storage.

### Kibana

Kibana is a tool for ploting real-time data from Elasticsearch.

## How to apply it to new projects
* Clone this repository
* Write JSON logs using [Bunyan](https://github.com/trentm/node-bunyan).
Don't forget to specify the name and type keys
* Execute the command `docker-compose up` in this repository root folder

We are using Docker to orchestrate our monitoring stack, so we can achieve
parity between development and production environments, making for reliable
deployments.
