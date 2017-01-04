// fs used to save HTML to label.html
var fs = require('fs');

// http used to create HTTP server
var http = require("http");

// child_process.exec lets us execute shell commands
var spawn = require('child_process').exec;

// Create HTTP Server to listen for the Chrome Extension's request
http.createServer(function(request, response) {
  console.log("Message Received");

  // Make sure request is POST so it will have data
  if (request.method == 'POST') {
    request.on('data', function(chunk) {
      fs.writeFile("/home/pi/dymo/label.html", chunk, function() {
        console.log("HTML saved to label.html");
      });
    });
  }
  // When the request ends, save and send to the parsing script
  request.on('end', function() {
    var jobName = spawn('python /home/pi/dymo/jobName.py', function(err, out, code) {
    });
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Message Received\n");
  });
}).listen(9292);
