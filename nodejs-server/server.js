/***********************************************************************************
This file is the server that process requests
// get url/print/firstName/lastName/email/cost

After 1,000 characters the server will refuse to print thinking it is an error
This restriction can be found on line 52
**************************************************************************************/
// use express to host static page and also hosts the API t requests to print
var express = require('express');
var app = express();

// used to execute shell commands
var spawn = require('child_process').exec;

// used to write to a text file
var fs = require("fs");

// hosts the static back up page incase the chrome extention desidese to fail
// we keep the static pages in a sub folder for security reasons -- this way no one can access this folder without acess to the pi
// to acess the back up page just use http://127.0.0.1:8081/.. no need to go to the back up page folder
app.use('/', express.static(__dirname + '/backupPage/'));



// this is the actual print request being processed
// get url/print/firstName/lastName/email/cost
app.get('/print/:firstName/:lastName/:email/:cost', function (req, res) {

  // this allows the chrome extention to actually use this
  // TODO for later security we should only allow interal IP's to go here
  res.setHeader('Access-Control-Allow-Origin', '*');


  // lets get the date and put it in the form dd/mm//yyyy
  var date = new Date();
  var dd = date.getDate();
  var mm = date.getMonth()+1; //January is 0!
  var yyyy = date.getFullYear();
  if(dd<10){
    dd='0'+dd; // add a zero to make user friendly
  }

  // we wont add a zero to the month just so that people can know which is month and which is day

  var date = dd+'/'+mm+'/'+yyyy;

  // text that we want to print
  var text = req.params.lastName + "\n" + req.params.firstName + "\n" + req.params.email +"\n" + req.params.cost +"\n" + date;

  // as a basic security check we would not want to print something that is over 1000 characters because that would be wastefull
  if(text.length > 1000){
    res.end("Paremeters were too long.. request denied due to save ink (server.js line 51)");
  }
  // if its shorter than that we can print it
  else{
    // write that text to a file called print.txt
    fs.writeFile("print.txt", text , function(err) {});


    // print to dymo
    spawn('lpr -P DYMO_LabelWriter_450_Turbo -o portrait print.txt', function(err, out, code){});

    // send back that printing was a sucess
    res.end("sucess");
  }

});


// make the server listen on port 8081
var server = app.listen(8081, function () {
  console.log("server loaded on: http://127.0.0.1:8081/");
})
