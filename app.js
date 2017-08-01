var express = require('express')
var app = express()
var crawler = require('crawler');


//Crawler for the website.
var c = new crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{

            //Scrape shit using Cheerio.
            var $ = res.$;

            //a lean implementation of core jQuery designed specifically for the server
            var Titles = $("tbody tr td.col-asset-name").text();

            var Clearer = Titles.split('\n')

            var Trimmed = [];

            var All_Titles = [];

     /*

        LOOP through the all of the data and create an array with the titles of the ICOs.

     */

        //Trim all of the strings.
            for(var i = 0; i < Clearer.length; i++){

              var trimmed_string = Clearer[i].trim()

              Trimmed.push(trimmed_string)

             }

        //Loop the trimmed strings and remove all of the strings.
          for(var i = 0; i < Trimmed.length; i++){

            var alphabet_exists = alphabetStart(Trimmed[i]).alphabet

            if(alphabet_exists){
              All_Titles.push(Trimmed[i])
            }

          }

        }
        done();
    }
});

c.queue(['https://tokenmarket.net/ico-calendar']);

// Get request for the main route.
app.get('/', function(req,res){
  res.send('Homepage');
})



//PORT tht we will listen on.
var PORT = 3000;



//Start the application.
app.listen(PORT, function(){
  console.log('Listening on PORT: ', PORT);
})


//Function that checks if the first letter of a string starts with any alphabet.
function alphabetStart(string){

  var alphabetLowercase = ("abcdefghijklmnopqrstuvwxyz").split("");
  var alphabetCapital = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split("");

  //Get the first letter of the string.
  var firstLetter = string.charAt(0)

  //Check for lowercase first letters.
  for(var l = 0; l < alphabetLowercase.length; l++){

    if(firstLetter == alphabetLowercase[l]){
      return { alphabet : true, message : 'Alphabet Exists'}
    }

  }

  //Check for uppercase first letters.
  for(var c = 0; c < alphabetCapital.length; c++){

    if(firstLetter == alphabetCapital[c]){
      return { alphabet : true, message : 'Alphabet Exists'}
    }

  }


  return { alphabet : false, message : 'Alphabet Nonexistant'}

}

/*

GOAL - AQUIRE ICO DATA.

METHODS
-------

1) SCRAPE WEBSITES FOR ICO DATA

2) FIND AN API for ICO DATA.


*/
