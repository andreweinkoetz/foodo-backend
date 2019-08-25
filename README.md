# Foodo backend

## Getting started

This repository is set-up for unix systems only. Some scripts will not work on Windows, so it is storngly recommended that you work with this repository on a unix machine.

##### `npm install`

Install all third party dependencies. See `package.json` for more information.

##### setup `.env`

Create a new file called `.env` and copy the template from `EXAMPLE.env`. Ask your co-contributors for the secrets and save them to your .env file. Please make sure that you keep the .env file private and do not share the information in the file with anyone. Do not add `.env` to git! 

##### `npm run dev`

This will start the development server on localhost. Please make sure that you have set the Port within the `.env` file. e.g. `PORT=3333`

## API endpoint usage
In this part you will find information on how to use the backend-api. This will be replaced by `swagger-ui` endpoint documentation in future releases.
The following endpoints have been implemented:

- / (root)
- /user (user-profile & user-based recipes related endpoint)
- /auth (authentication-oauth2-token endpoint)
- /recipes (endpoint to crud recipes)
- /ingredients (endpoint to crud ingredients)
- /allergies (profile-endpoint: only get allergies)
- /categories (profile-endpoint: only get categories)
- /lifestyles (profile-endpoint: only get lifestyles)
- /goals (profile-endpoint: only get goals)

## / 
This endpoint is for testing purposes only. It will reply with string `'Foodo backend received HTTP GET method'`.

## /auth
This endpoint hosts all authentication related methods. Behind the scenes an oauth2-server handles your request to obtain or validate a token. 

| Endpoint (METHOD)     | Req-Body     | Response  |
| :------------------------------- | :----: | :-----:|
| **/register** (POST)  | user object `user: { name, password, locale }`      |   newly created user object      |
| **/token** (POST)  | `req` as described in [here](https://tools.ietf.org/html/rfc6749.html) (password, refresh & auth-code grant_types are available)  | Bearer token to use in new requests.     |
| **/authorize** (GET) |   -   |    Bearer token     |
| **/password** (PUT) |   `{ password }` string   |    `{ msg: 'Password updated successfully' }`     |

## /user
This endpoint hosts all user and corresponding recipes related methods. All request must contain a valid bearer token in the authorization header.

| Endpoint (METHOD)        | Req-Body     | Response  |
| :------------------------------- | :----: | :-----:|
| **/me** (GET)  |  - |   user object      |
| **/level** (PUT)  |  `{ level }` string  |  updated user object    |
| **/locale** (POST)  |  `{ locale }` string  |  updated user object    |
| **/allergies** (POST) |   `[{ allergy }]` allergies array   |    updated user object     |
| **/allergies** (PUT) |   `{ allergy }` allergy object   |    `{ msg: 'Successfully added allergy' }`   |
| **/allergies** (DELETE) |   `{ allergy }` allergy object   |    `{ msg: 'Successfully removed allergy' }`   |
| **/dislikes** (POST) |   `[{ dislikes }]` ingredients array   |    updated user object     |
| **/dislikes** (PUT) |   `{ dislike }` ingredient object   |    `{ msg: 'Successfully added dislike' }`   |
| **/dislikes** (DELETE) |   `{ dislike }` ingredient object   |    `{ msg: 'Successfully removed dislike' }`   |
| **/goal** (POST)  |  `{ goal }` goal object  |  updated user object    |
| **/lifestyle** (POST)  |  `{ lifestyle }` lifestyle object  |  updated user object    |
| **/recipes** (POST)  |  `{ personalizedRecipe }` personalizedRecipe object  |  newly created personalized recipe object    |
| **/recipes** (PUT)  |  `{ personalizedRecipe }` personalizedRecipe object  |  updated personalized recipe object    |
| **/recipes** (GET)  |  -  |  `[{ personalizedRecipe }]` personalizedRecipe object array    |
| **/recipes/:id** (GET)  |  -  |  `{ personalizedRecipe }` personalizedRecipe object with :id  |
| **/recipes/substitute** (PUT)  |  `{ substituteId, originalId, amount } ` |  `{ personalizedRecipe }` updatec personalizedRecipe object |
| **/user/recipes/substitute** (DELETE)  |  `{ historyId } `  |  `{ personalizedRecipe }` updated personalizedRecipe object  |

## /allergies /categories /lifestyles /goals
These endpoints host their namely-related methods. They are used for initiliazing the frontend ui.

| Endpoint (METHOD)        | Req-Body     | Response  |
| :------------------------------- | :----: | :-----:|
| **/allergies** (GET)  |  - |   `[{ allergy }]` allergy object array      |
| **/lifestyles** (GET)  |  -  |  `[{ lifestyle }]` lifestyle object array   |
 | **/categories** (GET)  |  -  | `[{ category }]` food category object array    |
 | **/goals** (GET)  |  -  |  `[{ goal }]` goal object array    |

## /recipes
This endpoint hosts all recipe related methods. Will only be used in admin interface during prototype phase.

| Endpoint (METHOD)        | Req-Body     | Response  |
| :------------------------------- | :----: | :-----:|
| **/** (POST)  |  `{ recipe }` recipe object  |  newly created recipe object    |
| **/** (GET)  |  -  |  `[{ recipe }]` recipe object array    |
| **/:id** (GET)  |  -  |  `{ recipe }` recipe object with :id    | 
| **/:id/substitutes** (GET)  |  -  |  `{ result }` substitute ingredients calculated by algorithm    | 
| **/:id/blocksubstitute** (GET)  |   `{ subId, origId }` IDs of substituting ingredient and replaced ingredient  |  `{ msg: success }` if successfully blocked    | 

## /ingredients
This endpoint hosts all ingredient related methods. Will only be used in admin interface during prototype phase.

| Endpoint (METHOD)        | Req-Body     | Response  |
| :------------------------------- | :----: | :-----:|
| **/** (GET)  |  -  |  `[{ ingredient }]` ingredient object array    |
| **/:id** (GET)  |  -  |  `{ ingredient }` ingredient object with :id    | 
| **/group/:id** (GET)  |  -  |  `[{ ingredient }]` ingredient object array of group/category :id    |
| **/changevalue** (POST)  |  `{ id }` ingredient id string & `{ amount }` real number relative to amount 100ml/g   |  `{ message: 'Successfully updated ingredient' }`    |

## /cooking
This endpoint hosts all cooking related methods used by Alexa.

| Endpoint (METHOD)        | Req-Body     | Response  |
| :------------------------------- | :----: | :-----:|
| **/start** (POST)  |  `{ recipeName }` |  `{ possibleSubstitutes }` top 3 substitutes for `recipeName`, creates CookingEvent object  |
| **/substitutes** (GET)  |  -  |  `{ possibleSubstitutes }` top 3 substitutes for last recipe of user  | 
| **/substitute/:selectedNumber** (GET)  |  -  |  `{ ingredient, original }` names of replaced and subsitute ingredient   |
| **/block** (POST)  |  -  |  ` { msg: 'Success!' }` blocks substitution of current ingredient in selected recipe   |
| **/nutriscore** (GET)  |  -  |  `{ oldValues, oldScore, newValues, newScore, oldWeight, newWeight }` calculates all values regarding improvement of recipe (nutriscore, kj, weight)   |

## /subscription
This endpoint hosts all cooking related methods used by Alexa.

| Endpoint (METHOD)        | Req-Body     | Response  |
| :------------------------------- | :----: | :-----:|
| **/create** (POST)  |  `{ plan_id, id }` |  `{ msg: 'Successfully created subscription' }`  |
| **/cancel** (POST)  |  `{ id }` |  `{ msg: 'Success' }`  | 
| **/subscribed** (PUT)  |  `{ id }`  |  `{ msg: 'Success' }`   |


## AWS Elastic Beanstalk deployment
In order to deploy to AWS EB make sure to have a `.npmrc` file in the root folder of the project. This is necessary for `bcrypt`: [see here](https://github.com/kelektiv/node.bcrypt.js/wiki/Installation-Instructions) for details.
Content of file:
```
# Force npm to run node-gyp also as root, preventing permission denied errors in AWS with npm@5 or @6
unsafe-perm=true

```
The folder `.ebextensions` contains the node command to start up the application on AWS EB.

