/***********************************************************************************
This file is the server that process requests
// get url/print/firstName/lastName/email/cost

After 1,000 characters the server will refuse to print thinking it is an error
This restriction can be found on line 52
**************************************************************************************/
// Host manual upload page and also hosts the API requests to print
var express = require('express');
var app = express();

// Execute shell commands
var spawn = require('child_process').spawn;

// Write text file to send to the Dymo
var fs = require("fs");

// Hosts the static backup page in case the chrome extention fails for some reason.
// we keep the static pages in a sub folder for security reasons -- this way no one can access this folder without access to the pi
// to acess the back up page just use http://labelserver:8081/.. no need to go to the back up page folder
app.use('/', express.static(__dirname + '/backupPage/'));



// this is the actual print request being processed
// get url/print/firstName/lastName/jobID/email/cost
app.get('/print/:firstName/:lastName/:id/:email/:cost', function (req, res) {

  // Allow the chrome extension to receive the respons 
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Put date in the form dd/mm/yyyy
  var date = new Date();
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January is 0
  var yyyy = date.getFullYear();
  if(dd<10){
    dd='0'+dd; // add a zero to make user friendly
  }

  // we wont add a zero to the month just so that people can know which is month and which is day

  var date = mm+'/'+dd+'/'+yyyy;
	
	var email = req.params.email.replace('@', '@\n');

  // text that we want to print
  var text = req.params.lastName + ",\n" + req.params.firstName + "\n\n" + email +"\n\n" + req.params.id + "\nCost:\n" + req.params.cost +"\n" + date;

  // as a basic security check we would not want to print something that is over 1000 characters because that would be wastefull
  if(text.length > 100000){
    res.end("Paremeters were too long.. request denied due to save ink (server.js line 51)");
  }
  // if its shorter than that we can print it
  else{

    // write that text to a file called print.txt
    fs.writeFile("print.txt", text , function(err) {});


    // wake up printer and then  print 
    spawn('cupsenable DYMO_LabelWriter_450_Turbo && lp print.txt', {shell: true});

    // send back that printing was a success
    res.end("success");
  }

});


// make the server listen on port 8081
var server = app.listen(8081, function () {
  console.log("server loaded on: http://labelserver:8081/");
})
