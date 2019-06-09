/* JS file for the express backend server that will handle routing; Serve the static public files (images, css); receive post or get request and send responses appropriately */

/* Some resources:
    https://expressjs.com/en/starter/static-files.html
    https://www.codementor.io/codeforgeek/build-website-from-scratch-using-expressjs-and-bootstrap-du107sby7
    https://cloud.google.com/community/tutorials/run-expressjs-on-google-app-engine
*/
const express = require('express'); 
var bodyParser = require("body-parser");
var querystring = require('querystring');
var http = require('http'); //For making http requests using LoL API
var request = require('request');
const app = express();

const APIKEY = "<APIKEY HERE>" /* Note: Don't commit the APIKEY */
const SERVICE_REGIONS = ["BR","EUNE","EUW","JP","KR","LAN","LAS","NA", "OCE", "TR", "RU", "PBE"]; //Valid service regions
const SERVICE_PLATFORM = ["br1", "eun1", "euw1", "jp1", "kr", "la1", "la2", "na1", "oc1", "tr1", "ru", "pbe1"]; // Corresponding service platform for the api call

var viewPath = __dirname + '/views';
var publicPath = __dirname + '/public';
var summonerData = {};          //Store user data
var summonerIDArr = {};  //Store Summonername - SummonerID
var summonerData = {};   //Store user data
var invalidSearch = {};  //Store SummonerName x ServiceRegion API request that returned an error, prevent useless future API call, objects inside should be "summonerName": ["region1", "region2", etc.]


app.use(express.static(publicPath));

//Root route, just send the homepage
app.get('/', (req, res) => {
    res.sendFile(viewPath + "/index.html");
});

//Post request, submit button - still do checks
app.post('/submit', (req, res) => {
    //https://developer.riotgames.com/regional-endpoints.html
    //Check if get parameters exist and Service region passed in is valid
    if(req.query.regionName === undefined || req.query.summonerName === undefined || !SERVICE_REGIONS.includes(req.query.regionName))
    {
        res.sendFile(viewPath + "/index.html");
    }
    else
    {
        //Check if Summoner Name is valid, invalid -> Landing page
        if(!/^[0-9\\p{L} _\\.]+$/.test(req.query.summonerName))
        {
            res.sendFile(viewPath + "/index.html");
        }
        else
        {
            //Check if combination of summoner name and service region is already recorded in the invalidSearch object, 
            //If so, we know API call using the values returned error in the past and we can skip the search
            if(invalidSearch[req.query.summonerName] !== undefined && invalidSearch[req.query.summonerName].includes(req.query.regionName) )
            {
                res.sendFile(viewPath + "/index.html");
            }
            else
            {
                var platformIndex = SERVICE_REGIONS.indexOf(req.query.regionName);
                var apiRequest = "https://" + SERVICE_PLATFORM[platformIndex] + "api.riotgames.com/lol/";
                //Make API call
                //Do API call (http get request)
                /* https://developer.riotgames.com/getting-started.html */

                /* Resource for the alert: https://stackoverflow.com/questions/52003021/node-js-express-request-fade-in-and-out-bootstrap-modal-on-request-error */
                //Callbacks, wrap in API call 
                //success callback
                /*
                res.status(200);
                res.set({
                    'Content-Type': 'text/html',
                });
                res.write('<div class="alert alert-success alert-dismissible fade show">');
                res.write('<strong>Success</strong>Summoner Found - Stats should be displayed shortly.');
                res.write('<button type="button" class="close" data-dismiss="alert">&times;</button></div>');
                //Display stats in table
                res.end();

                //failure callback, wrap 
                res.status(404);
                res.set({
                    'Content-Type': 'text/html',
                });
                res.write('<div class="alert alert-danger alert-dismissible fade show">');
                res.write('<strong>Error</strong>Summoner not found - Please enter another summoner name.');
                res.write('<button type="button" class="close" data-dismiss="alert">&times;</button></div>');
                res.end();
                //Part of error callback, Add summonername x Service region in the invalid array
                if(!invalidSearch.includes(req.query.summonerName))
                    invalidSearch[req.query.summonerName] = [req.query.regionName];
                else
                    invalidSearch[req.query.summonerName].push(req.query.regionName);
                    */
            }
        }
    }
});

//Wildcard for non-existant pages
app.get('*', (req, res) => {
    res.sendFile(viewPath + "/404.html");
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://localhost:${port}`);
});

//Get encrypted summoner ID used for further API calls
var getSummonerByName = function(apiBaseURI, summonerName) {
    var reqURI = apiBaseURI + "summoner/v4/summoners/by-name/" + summonerName;
}

// Win/Loss ratio
// Win streak
var getLeagueEntries = function (apiBaseURI, summonerID) {
    var reqURI = apiBaseURI + "league/v4/entries/by-summoner/{encryptedSummonerId}" + summonerID;
}


/* Stats to display according to features requirement; Reminder: 
-Summoner Win/Loss ratio (maybe with win, loss too) 
-Summoner's current win streak
-Summoner's current rank
-Summoner's win/loss for each Champion
-Summoner's Champion Mastery (lots of data to display, maybe narrow it down more(?))

First 4 might be able to be displayed in the summoner stat page
Champion Mastery might need its own request/ response to display
*/
