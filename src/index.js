const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("halllo");
});

const port = process.env.PORT || 8080;
app.listen(port);

/*
var http = require("http");

//create a server object:
http
  .createServer(function(req, res) {
    res.write("Hello World!"); //write a response to the client
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080
*/
