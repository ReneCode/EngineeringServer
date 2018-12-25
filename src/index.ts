import express = require("express");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const bodyParser = require("body-parser");

import persistence from "./persistence";
import schema from "./schema";
import rootValue from "./rootValue";
import initData from "./initData";

require("dotenv").config();

const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const graphql = graphqlHTTP({
  schema: schema,
  rootValue: rootValue,
  graphiql: true
});
app.use("/graphql", graphql);

app.use("/persistence", persistence);

app.get("/", (req: any, res: any) => {
  res.send(
    'Hi, engineering server is running. Try <a href="/graphql">graphql</a'
  );
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  initData();
  console.log("app listening on port:", port);
});
