import express = require("express");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require("http");
const https = require("https");

import persistence from "./persistence/persistence";
import objectstoreRouting from "./persistence/objectStoreRouting";
import adminRouting from "./routing/adminRouting";
import schema from "./schema";
import rootValue from "./rootValue";
import initData from "./initData";
import applicationInsightsLogger from "./applicationInsightsLogger";
import WsServer from "./WsServer";

require("dotenv").config();
const app = express();

if (applicationInsightsLogger.init()) {
  applicationInsightsLogger.trackHttpRequests(app);
}

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(morgan("tiny", {}));

const graphql = graphqlHTTP({
  schema: schema,
  rootValue: rootValue,
  graphiql: true
});
app.use("/graphql", graphql);

app.use("/api/objectstore", objectstoreRouting);
app.use("/api/admin", adminRouting);
app.use("/persistence", persistence);

app.get("/", (req: any, res: any) => {
  res.send(
    'hi, engineering server is running. Try <a href="/graphql">graphql</a>.'
  );
});

// initData();

const port = process.env.PORT || 8080;
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log("app listening on port:", port);
});

const wsServer = new WsServer();
wsServer.listen(httpServer);
