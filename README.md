browsertest
===========


Setup
=====

1. Install [Meteor](https://www.meteor.com/install).
2. Install [Boot2Docker](https://github.com/boot2docker/osx-installer/releases).
3. Clone this repository: `git clone git@github.com:jakozaur/browsertest.git`.

=== Docker setup ===
In new terminal tab:

1. `boot2docker init`
2. `boot2docker up`
3. Create `setting.json` in your meteor app with settings based on previous step output:
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
4. `boot2socker ssh`
5. `docker pull jakozaur/docker-selenium:v1.1`
6. `docker run -p 4444:4444 -p 5555:5555 -d jakozaur/docker-selenium:v1.1`
7. Verify with `docker logs [id-from-previous-step]`


=== VNC proxy setup ===
In new Terminal tab:

1. `git clone git@github.com:kanaka/noVNC.git`
2. `cd noVNC`
3. `./utils/launch.sh --vnc 192.168.59.103:5555`
  You may need to replace ip with one from `boot2docker ip`

=== Setup the temporary package ===
In new tab:

1. `git clone git@github.com:jakozaur/meteor-dockerode.git`
2. `cd [meteor-app]`
3. `mkdir packages`
4. `ln -s ../meteor-dockerode packages/ongoworks:dockerrode`

=== Run the project ===
`meteor --settings settings.json`
