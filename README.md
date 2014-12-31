browsertest
===========


Setup
=====

1. Install [Meteor](https://www.meteor.com/install).
2. Install [Boot2Docker](https://github.com/boot2docker/osx-installer/releases).
3. Clone this repository: `git clone git@github.com:jakozaur/browsertest.git`.

### Docker setup
In new terminal tab: (any folder)

1. `boot2docker init`
2. `boot2docker up`
3. Create `browsertest/setting.json` with settings based on previous step output:
```
{
  "docker": {
    "protocol": "https",
    "host": "192.168.59.103",
    "port": 2376,
    "certPath": "/Users/jacek/.boot2docker/certs/boot2docker-vm/"
  }
}

```
4. `boot2docker ssh`
5. `docker pull jakozaur/docker-selenium:v1.1`
6. `docker run -p 4444:4444 -p 5555:5555 -d jakozaur/docker-selenium:v1.1`
7. Verify with `docker logs [id-from-previous-step]`


### Setup the temporary package
In new tab: (in separate folder)

1. `git clone https://github.com/jakozaur/meteor-dockerode.git`
2. `cd [meteor-app]`
3. `mkdir packages`
4. `ln -s ../meteor-dockerode packages/ongoworks:dockerrode`

Run the project
===============
`meteor --settings settings.json`
