const express = require("express");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema");
const rootValue = require("./rootValue");

const app = express();
app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: rootValue,
    graphiql: true
  })
);
app.get("/", (req, res) => {
  res.send("hi engineering server. Try /graphql");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("app listening on port:", port);
});
