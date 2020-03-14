# sheets-apps-script-serverless-graphql

## About

This project allows you to expose a Google Sheet as a GraphQL API using a free Google Apps Script.

Note that the exposed parts are accessible without authentication.

This is an early proof of concept made for fun, while I was learning about GraphQL. It only supports reading at the moment, and it is not optimized for large datasets.

## Caveats

 - Due to Apps Script limitations, there is always a redirect before the API returns a result, and that confuses some GraphQL clients.
 - Due to Apps Script limitations, the Content-Type header in the response is "application/json; charset=utf-8", and that confuses some GraphQL clients as they expect "application/json".
 - Apps Script has quotas. (https://developers.google.com/apps-script/guides/services/quotas)
 - Apps Script response times are in general not great for exposed services.

## Requirements

* Node.js v8 or higher
* [Yarn 1](https://classic.yarnpkg.com/en/docs/install)
* [clasp](https://github.com/google/clasp)

## Install

### Install and setup clasp

1. Install [clasp](https://github.com/google/clasp), and [enable the Google Apps Script API](https://script.google.com/home/usersettings).

2. Login with your google account.

```
$ clasp login
```

### Install this project

```
$ git clone https://github.com/kalmi/sheets-apps-script-serverless-graphql.git
```

After cloning this repository:

```
$ cd sheets-apps-script-serverless-graphql
$ yarn install
```

### Create your first exposed sheet

1. Create a new Google Apps Script attached to a new Google Sheet.

```
$ clasp create --type sheets --rootDir ./dist
```

Alternatively you could add it to a preexisting sheet if you specify [--parentId](https://github.com/google/clasp/blob/master/README.md#create) instead of --type.

2. Add the following to dist/appsscript.json

```
  "webapp": {
    "access": "ANYONE_ANONYMOUS",
    "executeAs": "USER_DEPLOYING"
  },
```

3. Build the project

```
$ yarn build
```

4. Push the dist directory to Google Apps Script

```
$ yarn push
```

5. Create a deployment to expose the GrahpQL API

```
$ yarn deploy
```

## Usage

```
$ yarn build
$ yarn push
$ yarn deploy
```

## Development

If you watnt to use watch mode, run the next command.

```
$ yarn watch
```

In watch mode, the build file is automatically pushed and deployed when saving the contents in the `src` folder.

## License

[MIT](LICENSE)
