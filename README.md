# 🐦🐦🚚

Please make sure you have 

Docker version 17.06.1-ce, build 874a737 and 
docker-compose version 1.15.0, build e12f3b9

installed. 

Older version compatible with docker compose file format version 3 may work but is not tested.

## Start the app
`sudo docker-compose up`

It should work without any configuration.

## In case you want to change the config file for anothor env
The docker container config folder is mapped to your host config folder, if you want to change any config,
you can create a json file in config folder. (i.e. test.json)
To use this config, you can use the command

`sudo NODE_ENV=test docker-compose up`
