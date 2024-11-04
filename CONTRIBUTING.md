# Contributing Guide

---

## Requirements
- MacOS or Linux (Windows may work too, but we haven't tested it)
- [NodeJS](https://nodejs.org/en/download/package-manager/) 18.x or above
  - Check version by running `node -v` on terminal
- [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Mysql](https://www.mysql.com/)
- [Docker](https://docs.docker.com/engine/install/) (for running mysql locally)

## Get started

1. Fork the project
2. Clone your forked project by running `git clone https://github.com/tecklens/abflags.git`
3. Run `cd abflags`
4. Run `npm i` to install dependencies
5. If you have Docker installed, run `docker compose up`
6. If you run local, run backend `nx serve api`, run frontend `nx serve client`


## Changing Configuration Settings

If you need to change any of the default configuration settings, you can use environment variables:
- Backend: `apps/api/.env`, `apps/api/.env.dev`, `apps/api/.env.prod`
- Frontend: `apps/client/.env`

## Writing code!

This repository is a monorepo with the following packages:

- ***apps/api***: is an Nestjs app and serves as the REST api for the front-end.
- ***apps/client***: is a Reactjs app (Vite) and contains the full UI of the Abflags app.
- ***libs/shared***: is a collection of Typescript functions, interface, types and constants shared between the front-end and back-end.
- ***libs/js-sdk***:  is our javascript/typescript SDK
- ***docs***: show more in this repository [docs](https://github.com/tecklens/abflags.docs.git)

Depending on what you're changing, you may need to edit one or more of these packages.

## Working on the main app

Run `nx serve api` to run backend, and run `nx serve client` to run frontend.

The packages are available at the following urls with hot-reloading:

- Frontend: http://localhost:4200/
- Backend: http://localhost:3232/

### Accessing the Mysql database

Create user for abflags:
```shell
create user 'abflags'@'<ip pc address>' identified by '<password in backend env>';
```
Grant permission for backend:
```shell
GRANT ALL PRIVILEGES
ON abflags.*
TO 'abflags'@'<ip pc address>'
IDENTIFIED BY '<password in backend env>'
WITH GRANT OPTION;
```

## Opening Pull Requests

1. Please Provide a thoughtful commit message and push your changes to your fork using git push origin main (assuming your forked project is using origin for the remote name and you are on the main branch).
2. Open a Pull Request on GitHub with a description of your changes.

## Getting Help
Join our [Slack community](https://abflags.slack.com/join/shared_invite/zt-2tl7yxmfb-evLQQYp5CIgGraG~ijXU4Q) if you need help getting set up or want to chat. We're also happy to hop on a call and do some pair programming.
