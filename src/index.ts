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

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: rootValue,
    graphiql: true
  })
);

app.use("/persistence", persistence);

app.get("/", (req: any, res: any) => {
  res.send("hi engineering server. Try /graphql");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  initData();
  console.log("app listening on port:", port);
});
