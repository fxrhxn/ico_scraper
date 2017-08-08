var express = require('express')
var app = express()
var crawler = require('crawler');
var _ = require('lodash');
var moment = require('moment')

// GET [ /api/ico/all ]
// All of the ico's out there.
app.get('/api/ico/all', function(req,res){


  //Main function that builds the fucking crawler.
  var ICO_Crawler = new crawler({
    maxConnections : 10,
    callback : function(err, resp, done){
      if(err){


        //Error response to send.
        var error_response = {
          success : false,
          message : 'Failed to get the data.',
        }

        //Send the error response.
        res.send(error_response)

        done()
      }else{

        //Scrape shit using Cheerio.
        var $ = resp.$;

        //HTML to find to extract data.
        var htmlfinder_titles = 'div.ico-wrap div.ico'

        //You need to find the links to the site. There should be a better way to get the hrefs.
        var htmlfinder_links = 'div.ico-links'


        //Get the titles of the ICO.
        var Titles = $(htmlfinder_titles).text();
        var Urls = $(htmlfinder_links).attr('href');


        //Print out the URLs that come in.
        console.log(Urls)

        //Split the titles of the ICO up.
        var Split_Titles = Titles.split('\n')

        //Take out the space from the titles.
        var Split_Space_Cleared = space_clearer(Split_Titles);

        //Get all of the titles and clear out the empty strings.
        var All_Titles = emptyString_clearer(Split_Space_Cleared);

        //Split the titles
        var Titles_Split = _.chunk(All_Titles, 2)

        //Create a data object to send.
        var ICO_DATA = {
          date : moment().format('MMMM Do YYYY, h:mm:ss a'),
          message : 'Retrieved list of ICOs.',
          list : Titles_Split,
        }

        //Send out the data object.
        res.send(ICO_DATA)

        done()
      }


    }
  })

    // Call the ICO crawler.
    ICO_Crawler.queue(['https://www.icoalert.com/'])

})

app.get('/api/spec-file', (req,res) => {

    // Swagger documentation.
    var swagger_doc = {
    "swaggerVersion": "1.2",
    "apis": [
      {
        "path": "http://icoapp.herokuapp.com/api/ico/all",
        "description": "Generating ICO's for the application."
      }
    ]
  }

  res.send(swagger_doc)

})

//PORT tht we will listen on.
var PORT = process.env.PORT || 3000;


//Start the application.
app.listen(PORT, function(){
  console.log('Listening on PORT: ', PORT);
})


function testCall(url){
  //Crawler for the website.
  var c = new crawler({
      maxConnections : 20,
      // This will be called for each crawled page
      callback : function (error, res, done) {
          if(error){
              console.log(error);
          }else{

              //Scrape shit using Cheerio.
              var $ = res.$;

              //a lean implementation of core jQuery designed specifically for the server
              var Titles = $("tbody tr td.col-asset-name").text();
              var URLs = $("tbody img").attr('src');

              console.log(URLs)

              var Clearer = Titles.split('\n')
              var Trimmed = [];

              //Variable that holds all of the titles.
              var All_Titles = [];

              //Variable that holds all of the images.
              var All_Images = [];

              //Variable that holds all of the URLs
              var All_URLs = [];


       /*

          LOOP through the all of the data and create an array with the titles of the ICOs.

       */

          //Trim all of the strings.
              for(var i = 0; i < Clearer.length; i++){

                var trimmed_string = Clearer[i].trim()

                Trimmed.push(trimmed_string)

               }



          //Loop the trimmed strings and remove all of the strings, and push to a new array.
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

  c.queue([url]);

}

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


//Function that clears all of the white space inside of the array.
function space_clearer(arr){

  //Array that holds all of the trimmed strings.
  var trimmed_string = [];

  //Loop over the array and trim all of the strings.
  for(var i = 0; i < arr.length; i++){

    var changed = arr[i].trim();

    trimmed_string.push(changed)

  }

  //Return array of trimmed strings.
  return trimmed_string;

}

// Function that clears out the empty string.
function emptyString_clearer(arr){

  var cleared_arr = [];

  for(var i = 0; i < arr.length; i++){

    if(arr[i] != ''){
      cleared_arr.push(arr[i])
    }

  }

  return cleared_arr

}

function arr_object(arr){

}
/*

GOAL - AQUIRE ICO DATA.

METHODS
-------

1) SCRAPE WEBSITES FOR ICO DATA

2) FIND AN API for ICO DATA.


Well here is the current problem, I am getting the titles of the cryptos, but I am not getting anything interesting like the images or the URLs.
The goal is to scrape these websites and get a shit ton of data. So I should just aggregate data from a website that is more simpler and better. Maybe my current source is not good enough. Yeah, I will have to change the method.



*/





/*
Routes
-------


/api/


*/
