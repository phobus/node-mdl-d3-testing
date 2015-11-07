var http = require("http");
var fs = require("fs");
var path = require("path");


var port_number = process.env.PORT || 5000;

http.createServer(function(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/plain"
  });
  response.write("It's alive!");
  response.end();
}).listen(port_number);
