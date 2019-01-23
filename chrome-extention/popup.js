/***********************************************************************************
This file programs the popup that is triggered by clicking on the chrome extention
**********************************************************************************/



// Start listening for button click when popup.html loads
document.addEventListener('DOMContentLoaded', function() {



  // see if we should load the dymo print div if we are on a jobs page
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var dymo = document.getElementById("dymo-section");
    dymo.style.display = "none";
    // Note: this requires "activeTab" permission to access the URL
    // this regex pattern matches the MIC specific job url
    regex = /^https:\/\/umd.innovationcenter.makerbot.com\/jobs\/(\d)+/
    // if we are on the jobs page
    if(regex.test(tabs[0].url)) {
      // show the dymo-section div
      var dymo = document.getElementById("dymo-section");
      dymo.style.display = "block";


    }
    else  {
      var dymo = document.getElementById("dymo-section");
      dymo.style.display = "none";
    }
  });


  // make sure scanInputChange() runs each time input is changed
  var scanCode = document.getElementById("scanCode");
  scanCode.addEventListener('input', scanInputChange, false);
  // Create listener for the print dymo button
  var printButton = document.getElementById('printButton');
  printButton.addEventListener('click', buttonClicked, false);


}, false);


// runs when you change the value in the scan input
function scanInputChange(){
  console.log("here i am");
  var scan = document.getElementById('scanCode');
  var val = scan.value;
  // keep in mind this is a link
  var button = document.getElementById('fillamentButton');

  // first we check if there are enough numbers
  if (val.length==0) {
      document.getElementById("scanErrorText").innerHTML = "";
  }
  else if(val.length!=12){
      document.getElementById("scanErrorText").innerHTML = "Error: scan code is 12 digits";
  }

  else{
    // this is the color mapping for the Fillament.. in a later version we will move this
    var colorMap= {
      817913011135:"https://assets.tw.umd.edu/consumables/83/edit", // Translucent Red
      817913011401:"https://assets.tw.umd.edu/consumables/53/edit",//   Sparkly Dark Blue Small
      817913011036:"https://assets.tw.umd.edu/consumables/59/edit", // True Black
      817913011142:"https://assets.tw.umd.edu/consumables/55/edit", // Translucent Yellow
      817913011029:"https://assets.tw.umd.edu/consumables/76/edit", // Translucent Orange
      817913011180:"https://assets.tw.umd.edu/consumables/71/edit", // Glow in the Dark
      817913013030:"https://assets.tw.umd.edu/consumables/60/edit", // Lemon Drop
      817913011128:"https://assets.tw.umd.edu/consumables/61/edit", // Translucent Blue
      817913011043:"https://assets.tw.umd.edu/consumables/64/edit", // True Blue
      817913012064:"https://assets.tw.umd.edu/consumables/70/edit", // True Brown
      817913013467:"https://assets.tw.umd.edu/consumables/78/edit", //  and 331388808 // Slate Gray Tough PLA
      817913011425:"https://assets.tw.umd.edu/consumables/62/edit", // Neon Pink Small
      817913011562:"https://assets.tw.umd.edu/consumables/82/edit", // Khaki
      817913011050:"https://assets.tw.umd.edu/consumables/58/edit", // True Orange
      817913011357:"https://assets.tw.umd.edu/consumables/59/edit", // True Black Small
      817913011463:"https://assets.tw.umd.edu/consumables/86/edit", // Sparkly Black
      817913011456:"https://assets.tw.umd.edu/consumables/53/edit", // Sparkly Dark Blue
      817913013023:"https://assets.tw.umd.edu/consumables/81/edit", //Robin's Egg
      817913011388:"https://assets.tw.umd.edu/consumables/54/edit",  //True Green
      817913011173:"https://assets.tw.umd.edu/consumables/65/edit", //Cool Grey
      817913011159:"https://assets.tw.umd.edu/consumables/83/edit", //Translucent Purple
      817913011166:"https://assets.tw.umd.edu/consumables/63/edit", //Warm Gray
      817913011074:"https://assets.tw.umd.edu/consumables/73/edit", //True Red
      817913013047:"https://assets.tw.umd.edu/consumables/79/edit", //Jadeite)
      817913011555:"https://assets.tw.umd.edu/consumables/68/edit", //Ocean Blue
      817913011494:"https://assets.tw.umd.edu/consumables/80/edit", //Neon Green
      817913011081:"https://assets.tw.umd.edu/consumables/77/edit", //True White
      817913011104:"https://assets.tw.umd.edu/consumables/75/edit", //Natural
      817913011548:"https://assets.tw.umd.edu/consumables/57/edit", //Army Green
      817913011487:"https://assets.tw.umd.edu/consumables/85/edit", //Neon Orange
      817913012040:"https://assets.tw.umd.edu/consumables/74/edit", //Peach
      817913011098:"https://assets.tw.umd.edu/consumables/56/edit", //True Yellow)
      817913011067:"https://assets.tw.umd.edu/consumables/66/edit", //True Purple
      817913011791:"https://assets.tw.umd.edu/consumables/59/edit", // True Black XXL
      817913011784:"https://assets.tw.umd.edu/consumables/65/edit", // Cool GRey XXL
      817913011807:"https://assets.tw.umd.edu/consumables/77/edit", // True White XXL
      817913011760:"https://assets.tw.umd.edu/consumables/63/edit", // Warm Gray XXL
      817913012088:"https://assets.tw.umd.edu/consumables/67/edit", // light Brown
      817913011111:"https://assets.tw.umd.edu/consumables/69/edit"  // Translucent Green
    };

    // if there is a value
    if(colorMap[val]){

      document.getElementById("fillamentButton").href= colorMap[val];
      button.setAttribute("src",colorMap[val]);
      document.getElementById("scanErrorText").innerHTML = "";
    }
    else{
      document.getElementById("scanErrorText").innerHTML = "Error: not listed in the Chrome Extension";
    }



  }




  // var scan = document.getElementById('scanCode').value;
  // var url = colors[scan];

  // make an on edit function and update the url to the button

}

// When button is pressed scrape the web and send info to receiveMessage
function buttonClicked() {
	// Get an object for the active tab
  console.log("print dymo has been clicked");
	chrome.tabs.query({active: true, currentWindow: true}, function(tab_array){
		// send a messege to the contentscript that will then scrape the web
    // it will then call the popup.js receiveURL() method with the url it makes
    console.log("Messege sent to conntent script");
		chrome.tabs.sendMessage(tab_array[0].id, true, receiveURL);
	});
}

// When message is received, attempt to connect to API
// at this point we should have the full working url for tha Request
function receiveURL(url) {
  // if the web scraper fails (it will either return scrapeFailed or the url could be really long)
  console.log(url);
  if(url=="scrapeFailed"){

    // remove the print button
    printButton.parentNode.removeChild(printButton);
    // explain that request failed and give them link for manual page, then show them the webscrape error page
    document.getElementById('DymoErrorText').innerHTML = "<br/>Request Failed, click<a target='_blank' href='http://labelserver:8081/'> here </a>for manual input <br/>" +
     "For more infromation on this error click <a target='_blank' href='http://labelserver:8081/scrape.html'> here</a>";
    document.body.style.width = '400px'; // set pop up to be a bit wider to fit text well

  }
  // otherwise the request should pretty much work
  else{
    httpRequest = new XMLHttpRequest();
    // this will invoke onServerResponse() when server responds
    httpRequest.onreadystatechange = onServerResponse;
    httpRequest.open("GET", url, true);
    // because all the paremeters are sent in the URL, no method body needed
    httpRequest.send(null);
  }
}//.. end of receiveURL()

// this deals with the servers request
function onServerResponse() {

  if (httpRequest.readyState == XMLHttpRequest.DONE) {
  // at this point the server should have handled the request

  printButton.parentNode.removeChild(printButton); // remove the print button

  // if server sends back an okay and a sucess that means everything printed
	if (httpRequest.status == 200 && httpRequest.response=="success" ){
	   // change the text to the fact that request was sent to printer
     document.getElementById('DymoErrorText').innerHTML = "Printing infromation :)";
  	// Auto close after 2.1 seconds
		window.setTimeout(window.close, 2100);
	}
  // else means that most lilkey the server is not online (I cant think of any other problems)
  else{
      // explain that the server is down and and show a link to an internal webpage on how to fix it
			document.getElementById('DymoErrorText').innerHTML = "Server Down.. <br/>" +
      "Are you connected to Terrapin Works Wifi?";
      document.body.style.width = '300px';
    }
  }
}
