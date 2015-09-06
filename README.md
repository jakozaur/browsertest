browsertest
===========


Setup
=====

1. Install [Meteor](https://www.meteor.com/install).
2. Install [Docker Toolbox](https://www.docker.com/toolbox).
3. Clone this repository: `git clone git@github.com:jakozaur/browsertest.git`.
4. Install Virtualbox (v4.3.30 works)

### Docker setup
In new terminal tab: (any folder)

1. `boot2docker init`
2. `boot2docker up`
3. Create `browsertest/settings.json` with settings based on previous step output:
```
{
  "docker": {
    "protocol": "https",
    "host": "192.168.59.103",
    "port": 2376,
    "certPath": "/Users/jacek/.boot2docker/certs/boot2docker-vm/"
  },
  "meteor": {
    "localUrl": "http://192.168.59.3:3000"
  }
}

```
Note! the certPath value should match result of `echo $DOCKER_CERT_PATH`
4. `boot2docker ssh`
5. `docker pull jakozaur/docker-selenium:v1.3`
6. `docker run -p 4444:4444 -p 5555:5555 -d jakozaur/docker-selenium:v1.3`
7. Verify with `docker logs [id-from-previous-step]`


Run the project
===============
`meteor --settings settings.json`
