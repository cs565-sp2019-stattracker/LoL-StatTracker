/* JS file for the express backend server that will handle routing; Serve the static public files (images, css); receive post or get request and send responses appropriately */

/* Some resources:
    https://expressjs.com/en/starter/static-files.html
    https://www.codementor.io/codeforgeek/build-website-from-scratch-using-expressjs-and-bootstrap-du107sby7
    https://cloud.google.com/community/tutorials/run-expressjs-on-google-app-engine
*/
const express = require('express'); 
var bodyParser = require('body-parser');
var querystring = require('querystring');
var http = require('http'); //For making http requests using LoL API
var request = require('request');
const app = express();

const APIKEY = "<Replace with API KEY>" /* Note: Don't commit the APIKEY */
const SERVICE_REGIONS = ["BR","EUNE","EUW","JP","KR","LAN","LAS","NA", "OCE", "TR", "RU", "PBE"]; //Valid service regions
const SERVICE_PLATFORM = ["br1", "eun1", "euw1", "jp1", "kr", "la1", "la2", "na1", "oc1", "tr1", "ru", "pbe1"]; // Corresponding service platform for the api call

var viewPath = __dirname + '/views';
var publicPath = __dirname + '/public';
var summonerIDArr = {};  //Store Summonername - SummonerID
var summonerData = {};   //Store user data
var invalidSearch = {};  //Store SummonerName x ServiceRegion API request that returned an error, prevent useless future API call, objects inside should be "summonerName": ["region1", "region2", etc.]


app.use(express.static(publicPath));

//Root route, just send the homepage
app.get('/', (req, res) => {
    res.sendFile(viewPath + "/index.html");
});

//Test route
app.get('/test', (req, res) => {
    const testSummonerName = "eliptic";
    var apiRequest = "https://na1.api.riotgames.com/lol/";
    getSummonerByName(apiRequest, testSummonerName).then(
        function(data) {
            console.log(data);
        }
    );
    res.send("Reached end of test route, check serverside console log");
});


//Post request, submit button - still do checks
app.post('/submit', (req, res) => {
    //https://developer.riotgames.com/regional-endpoints.html
    //Check if get parameters exist and Service region passed in is valid
    if(!SERVICE_REGIONS.includes(req.body.regionName))
    {
        //https://stackoverflow.com/questions/35864088/how-to-send-error-http-response-in-express-node-js/35865605
        console.log("Error, Illegal region name" + req.body.regionName)
        return res.status(400).send({
            message: 'Illegal region name'
        });
    }
    //Check if Summoner Name is valid
    if(!/^[0-9\\p{L} _\\.]+$/.test(req.body.summonerName))
    {
        console.log("Error, Illegal character in Summoner Name" + req.body.summonerName)
        return res.status(400).send({
            message: 'Illegal character in Summoner Name'
        });
    }
    else
    {
        //Check if combination of summoner name and service region is already recorded in the invalidSearch object, 
        //If so, we know API call using the values returned error in the past and we can skip the search
        if(invalidSearch[req.body.summonerName] !== undefined && invalidSearch[req.body.summonerName].includes(req.body.regionName) )
        {
            return res.status(400).send({
                message: 'Summoner was not found in the region specified'
            });
        }
        var platformIndex = SERVICE_REGIONS.indexOf(req.body.regionName);
        var apiRequest = "https://" + SERVICE_PLATFORM[platformIndex] + ".api.riotgames.com/lol/";
        var summonerStats = {}; //Object that will contain the necessary stats to be displayed

        getSummonerByName(apiRequest, req.body.summonerName).then(
            function(data) {
                console.log(data);
                summonerStats[SummonerLevel] = data.summonerLevel;  //For display
                summonerStats[summonerID] = data.id;                //Encrypted, for other API call
                summonerStats[accountId] = data.accountId;          //Encrypted, for other API call

                //getChampionMastery
                getChampionMastery(apiRequest, req.body.summonerName).then(

                );

                //getLeagueEntries
                //Not sure how to get win/loss for each champion again??

                //Send object with gathered/ compiled summoner data to Frontend
                res.send(summonerStats);
            }


        ), function(err) {
            console.log(err);
        };
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
    console.log("executing getSummonerByName");
    var reqURI = apiBaseURI + "summoner/v4/summoners/by-name/" + summonerName + "?api_key=";
    console.log("ReqURI: " + reqURI);
    var options = {
        url: reqURI + APIKEY,
        json: true
    };

    var promise = new Promise(function(resolve, reject) {
        request.get(options, function(error, response, body){
            resolve (body);
        })
    });  

    promise.then(function(data) {
        return data; 
    }, function(err) {
        console.log(err); 
        return [];
    });

    return promise;
}

// Win/Loss ratio
// Win streak
var getLeagueEntries = function (apiBaseURI, summonerID) {
    console.log("executing getLeagueEntries");
    var reqURI = apiBaseURI + "league/v4/entries/by-summoner/" + summonerID  + "?api_key=" + APIKEY;

    var options = {
        url: reqURI + APIKEY,
        json: true
    };

    var promise = new Promise(function(resolve, reject) {
        request.get(options, function(error, response, body){
            resolve (body);
        })
    });  

    promise.then(function(data) {
        return data; 
    }, function(err) {
        console.log(err); 
        return [];
    });

    return promise;
}

// Champion Mastery
var getChampionMastery = function(apiBaseURI, summonerID) {
    console.log("executing getChampionMastery");
    var reqURI = "champion-mastery/v4/champion-masteries/by-summoner/" + summonerID  + "?api_key=" + APIKEY;

    var options = {
        url: reqURI + APIKEY,
        json: true
    };

    var promise = new Promise(function(resolve, reject) {
        request.get(options, function(error, response, body){
            resolve (body);
        })
    });  

    promise.then(function(data) {
        return data; 
    }, function(err) {
        console.log(err); 
        return [];
    });

    return promise;
}

//Summoner's win/loss for each Champion?

/* Stats to display according to features requirement; Reminder: 
-Summoner Win/Loss ratio (maybe with win, loss too) 
-Summoner's current win streak
-Summoner's current rank
-Summoner's win/loss for each Champion
-Summoner's Champion Mastery (lots of data to display, maybe narrow it down more(?))
*/
