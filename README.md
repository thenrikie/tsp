# 🐦🐦🚚

Please make sure you have 

Docker version 17.06.1-ce, build 874a737 and 
docker-compose version 1.15.0, build e12f3b9

installed. 

Older version compatible with docker compose file format version 3 may work but is not tested.

## Start the app
`sudo b617d2ca-6285-482b-a082-9988d098bee0 up`

It should work without any configuration and you should be able to access the app at

http://localhost:3000

## In case you want to change the config file for anothor env
The docker container config folder is mapped to your host config folder, if you want to change any config,
you can create a json file in config folder. (i.e. test.json)
To use this config, you can use the command

`sudo NODE_ENV=test docker-compose up`

## To change the port

You can change to forwarding port to something else other than 3000 by change the docker-compose.yml file

```
    ports:
     - "<NEW_PORT>:3000"
```

## Test

You can run unit tests by using the command
`npm test`

If you test locally please make use you do npm install first
