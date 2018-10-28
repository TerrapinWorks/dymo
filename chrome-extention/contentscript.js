/******************************************************************************
This file will scrape the current page for the infromation we need
it either responds back with 'scrapeFailed' or the url

If the innovationcenter html has changed this is the file you should edit
******************************************************************************/
// Listen for message from the Extension (received when button is pressed)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  // when there is a request (that will come in as true)
 if (request) {


   // this is used to grab the inner html that we then can scrape
   // it looks inefficient to me but I cant figure out another way to grab html
   var html = '',
     node = document.firstChild;
   while (node) {

     switch (node.nodeType) {
     case Node.ELEMENT_NODE:
        // grab tthe html we need
        html = node.outerHTML;
         break;
     }
     node = node.nextSibling;
   }

  //  console.log("HTML FIRST FEQ THINGIES" + html.substr(0,50));
  //  console.log("I AM HERE 1");
   /*********************************************************************
     IF YOU NEED TO CHANGE THE WEB SCRAPER START HERE
   **********************************************************************/

  // at this point html should have all the html we need
  
     //take out everything in the html before the tag "<label>Job:</label>"
   var split = html.split("<label>Job:</label>");
   html=split.slice(1,split.length).join(""); // put the html back together
   // Find job number
   split= html.split("</li>");
   var job = split[0]
   html=split.slice(1,split.length).join(""); // put the html back together
   job = job.replace("#", "");
   console.log("Job: %s", job);
   
   //take out everything in the html before the tag "<label>Requestor:</label>"
   split = html.split("<label>Requestor:</label>");
   html=split.slice(1,split.length).join(""); // put the html back together


   // split the text at the tag
   split = html.split("<li>");
   // the first part should be the name
   var name = split[0]; // format firstName LastName
   html=split.slice(1,split.length).join("");// put the html back together

   console.log("Name: %s", name);

   // change name to 'FirstName LastName' to FirstName/LastName
   name = name.replace(" ","/");
   // basically if it is uknown reply with a diff url

   if(name.includes("Unknown")){
     var url = "http://labelmaker:8081/print/"+ "PRINT/DIRECT" + "/" + job + "/" + "STAFF" + "/" + "$0.00";
    sendResponse(url);
   }
   else{
     // you get the idea...
     split = html.split("</label>");
     html=split.slice(1,split.length).join("");


      split =html.split(">");
      html=split.slice(1,split.length).join("");

      split = html.split("</a");
      var email = split[0];
      html=split.slice(1,split.length).join("");
	  
	  console.log("Email: %s", email);

      split =html.split("= ");
      html=split.slice(1,split.length).join("");

      split=html.split("<br");
      var cost = split[0];
      html=split.slice(1,split.length).join("");
	  
	  console.log("Cost: %s", cost)
	  
	  
	  

      /**************************************************************************
      THIS IS THE END OF THE SCRAPER
      ***************************************************************************/


      // now actually add all the params together
      var url = "http://labelmaker:8081/print/"+ name + "/" + job + "/" + email + "/" + cost;
      url = url.replace(" ",""); // take out any spaces
	  url = url.replace(/(\r\n|\n|\r)/gm,"");
      console.log(url);
      // if any of the parems are empty that is because the scrape failed
      // if it could also be beacuse the url is too long
      if(name="" || email=="" || cost=="" || url.length > 400){
        url = "scrapeFailed";
      }

    // send baclk the url
     sendResponse(url);
 }
 }

});
