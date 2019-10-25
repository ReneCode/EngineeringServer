[![Build Status](https://travis-ci.org/ReneCode/EngineeringServer.svg?branch=master)](https://travis-ci.org/ReneCode/EngineeringServer)

# EngineeringServer

# design the graphQL interface:

https://blog.apollographql.com/designing-graphql-mutations-e09de826ed97

# deploy node to azure:

https://blog.lifeishao.com/2017/03/24/custom-nodejs-deployment-on-azure-web-app/

- use typescript to compile the src files in src/\*_/_.ts to dist/(defined in tsconfig.json)
- use npm run build to create dist/ (compiled files)
- deploy only the dist/ folder

  - skip_cleanup: true on travis.yml to keep the compiled files
  - copy package.json to that dist/ folder so azure can make:
    - npm install
    - create a web.config out of the npm run start command

- set travis AZURE_WA_SITE, AZURE_WA_USERNAME, AZURE_WA_PASSWORD environment variables

- configuration / general settings /

  - Always on: true
  - Web sockets: true

  ( use websocket in client: wss://servername.con)

# use application insight for logging

https://docs.microsoft.com/de-de/azure/azure-monitor/app/nodejs

# vscode shortcuts

https://zellwk.com/blog/useful-vscode-keyboard-shortcuts/

# jest

If the test creates a file, that in watch mode jest re-runs the test => infinite loop.

To prevent that - just add in `jest.config.js` (ignore new files in the `data` folder)

```
module.exports = {
  watchPathIgnorePatterns: ["/data/"]
};
```

# postgress db

https://docs.microsoft.com/de-de/azure/postgresql/quickstart-create-server-database-portal

connect to local:

    psql <database> <user>

connect to azure postgress:

    psql --host=<host>.postgres.database.azure.com --port=5432 --username=<user>@<host> --dbname=<database>

# express

const router = express.Router();

// url parameter
// myserver.com/abc => name = abc
router.get("/:name", (req, res) => {
const name = req.params.name;
...
}

// query parameter
// myserver.com?name=abc => name = abc
router.get("/", (req, res) => {
const name = req.query.name;
})
