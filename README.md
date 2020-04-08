# Express.js + MongoDB JWT Authentication RESTful API

Simple Authentication API using node.js, express.js & mongoDB.

Written in ES6 syntax, use webpack & babel to build for development / production environment.

Not well tested, be careful to be used in production environment.

Server start at `http://localhost:5000` by default.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [API Usage](#api-Usage)

   1. [Sign In](#sign-in)
   2. [Sign Up](#sign-up)
   3. [Get User Profile](#get-user-profile)
   4. [Error](#error)

5. [Built With](#built-with)
6. [License](#license)

## Prerequisites

- Node.js
- MongoDB
- Yarn

## Installation

**Make sure to change `MONGO_URI` in `config/.dev.env` to your own mongoDB URI**

`yarn install` - install dependencies

`yarn dev` - start server in dev environment

`yarn build:prod` - build app for production

## Configuration

#### Environment Variable:

`config/.dev.env` - development

`config/.pro.env` - production

#### System Variable:

`config/config.js` - read from environment var and set default value to it

#### Others:

`app.js` - load middlewares, routes

`helpers/*` - third party module config

## API Usage

### Sign In

#### URL:

`POST` `/api/auth/sign_in`

#### Params:

| Type   | Name     |
| ------ | -------- |
| string | email    |
| string | password |

#### Success:

| Type   | Name       | Description      |
| ------ | ---------- | ---------------- |
| int    | status     | http status code |
| string | message    | simple message   |
| object | data       | return data      |
| string | data.token | JWT Token        |
| string | data.email | logged in Email  |

### Sign Up

#### URL:

`POST` `/api/auth/sign_up`

#### Params:

| Type   | Name     |
| ------ | -------- |
| string | userName |
| string | email    |
| string | password |

#### Success:

| Type   | Name       | Description      |
| ------ | ---------- | ---------------- |
| int    | status     | http status code |
| string | message    | simple message   |
| object | data       | return data      |
| string | data.token | JWT Token        |
| string | data.email | registered email |

### Get User Profile

#### URL:

`GET` `/api/users`

#### Header:

| Key           | Value           |
| ------------- | --------------- |
| Authorization | Bearer JWTToken |

#### Success:

| Type   | Name          | Description      |
| ------ | ------------- | ---------------- |
| int    | status        | http status code |
| string | message       | simple message   |
| object | data          | return data      |
| string | data.userName | user name        |

### General API Error

| Type   | Name    | Description              |
| ------ | ------- | ------------------------ |
| string | type    | error type               |
| int    | status  | http status code         |
| string | message | simple message           |
| string | error   | error description        |
| object | details | [optional] error details |

`TODO: Centralize error type into error code table`

## Built With

- Build Tools
  - [Webpack](https://webpack.js.org/)
  - [Babel](https://babeljs.io/)
- MongoDB
  - [mongoose](https://mongoosejs.com/)
  - [mongoose-unique-validator](https://github.com/wesbos/mongoose-unique-validator)
- Logger
  - [winston](https://github.com/winstonjs/winston)
  - [morgan](https://github.com/expressjs/morgan)
- Validation
  - [express-validation](https://github.com/express-validator/express-validator)
- Others
  - [dotenv](https://github.com/motdotla/dotenv) - load `.env` file into `process.env`
  - [argon2](https://www.npmjs.com/package/argon2) - hash
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
  - [cors](https://www.npmjs.com/package/cors)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
