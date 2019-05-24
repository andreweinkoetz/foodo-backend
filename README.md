# Foodo backend

## What is this repository for?

This repository provides the backend functionality for our student project in Future Business Labs (IN2106, IN2128, IN212807) at TUM.
Find the corresponding react-app (here)[https://github.com/andrelandgraf/react-oauth2-skeleton]. 

## Getting started

This repository is set-up for unix systems only. Some scripts will not work on Windows, so it is strongly recommended that you work with this repository on a unix machine (Mac, VM, Linux).

### IDE / Editor

Get yourself VSCode for a quick start. On Linux just run: `snap install code`. Other IDEs e.g. Webstorm work fine as well, just make sure that you have nice git and eslint support within your editor for more convenience.

For VSCode, we can recommend following extensions:

- eslint: A package that will show you all eslint linting errors within your code. Make sure to activate the checkbox "Auto fix on save" to ensure that all auto linting fixes will be fixed on every file save

### `npm install``

Install all third party dependencies. Below you can find a small summary of the most important packages that we use and a small description for why we need them. See `package.json` for more information.

#### Packages used:

- `express`
- ~~`express-oauth-server`~~ replaced by `oauth2-server` (no further development for express wrapper)
- `dotenv` - to quickly read secret variables from .env files via `process.env.VAR_NAME`
- `body-parser`
- `crons` - express middleware to allow cross-domain-requests

### setup .env

Create a new file called `.env` and copy the template from `EXAMPLE.env`. Ask your co-contributors for the secrets and save them to your .env file. Please make sure that you keep the .env file private and do not share the information in the file with anyone. Do not add `.env` to git! 

### `npm run lint`

We use eslint to verify that we are all on the same page when it comes to code formatting. Use `npm run lint` to check if you pass all linting requirements. For a detailled description how to setup eslint, please see the react-oauth2-skeleton repository (README.md)[https://github.com/andrelandgraf/react-oauth2-skeleton/master/README.md]

### `npm run dev`

This will start the development server on localhost. Please make sure that you have set the Port within the `.env` file. e.g. `PORT=3333`

## Usage of OAuth2

We use OAuth2 specs to authenticate our frontend and even third party services (e.g. a Alexa skill) with users from our express backend. Also, our React frontend also uses OAuth2 to login users. OAuth is quite a topic, so below you can find useful information to get started with the logic. 

### Obtaining new bearer token
For obtaining a new bearer token only the `password` grant of the [RFC6749](https://tools.ietf.org/html/rfc6749) is implemented. To obtain a new, valid token you have to provide the following information:

###### Body information
- Grant type: String as in RFC6749 defined (currently only `password` implemented)
- Username: Identification (e.g. email) of user that wants to obtain the token
- Password: Password of user

###### Header information
- Authorization: keyword '_Basic_' followed by `clientId:clientSecret` as base64 encoded string
- Content-Type: `application/x-www-form-urlencoded`

### Using token to authenticate
After receiving a new bearer token, it can be included in the header of every request to identify the current user. 

###### Header information
- Authorization: keyword '_Bearer_' followed by `<access-token>` as base64 encoded string

Currently the token includes email and id of a user (at time of creation) which would have to be permanently saved (e.g. db, file, etc.) using `saveToken()`-method.  

## Example of usage
For testing the examples please make sure you have `curl` installed on your machine.

###### Obtaining a new token:
```
curl http://localhost:3333/oauth/token \
	-d "grant_type=password" \
	-d "username=<username>" \
	-d "password=<verysecret>" \
	-H "Authorization: Basic YWxleGE6c2VjcmV0" \
	-H "Content-Type: application/x-www-form-urlencoded"
```
Should result in something like this:
```
{
"accessToken":"4ca38497aa7e75b4b144933e6eaf744925b23831", 
"accessTokenExpiresAt":"2019-05 20T11:22:34.292Z", 
"refreshToken":"47780f03558fa30d9d90872a1082795bd8693c67",
"refreshTokenExpiresAt":"2019-06-03T10:22:34.294Z", 
"client": <Your client object>, 
"user": <Your user object>
}
```

###### Using token to authenticate:
```
curl http://localhost:3333/auth/me \
	-H "Authorization: Bearer 4ca38497aa7e75b4b144933e6eaf744925b23831"
```
To receive your user object.
