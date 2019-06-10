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
const SERVICE_REGIONS = ["br","eune","euw","jp","kr","lan","las","na", "oce", "tr", "ru", "pbe"]; //Valid service regions
const SERVICE_PLATFORM = ["br1", "eun1", "euw1", "jp1", "kr", "la1", "la2", "na1", "oc1", "tr1", "ru", "pbe1"]; // Corresponding service platform for the api call
const CURRENT_SEASON = 9;    //Current season for filtering matchlist api request

var viewPath = __dirname + '/views';
var publicPath = __dirname + '/public';

app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Root route, just send the homepage
app.get('/', (req, res) => {
    res.sendFile(viewPath + "/index.html");
});

//Test route
app.get('/testAPIcall', (req, res) => {
    const testSummonerName = "eliptic";
    var apiRequest = "https://na1.api.riotgames.com/lol/";
    getSummonerByName(apiRequest, testSummonerName).then(
        function(data) {
            console.log(data);
        }
    );
    res.send("Reached end of test route, check serverside console log");
});

app.post('/frontendTest', (req, res) => {
    console.log(req.body.summoner);
    console.log(req.body.region);
    if(!SERVICE_REGIONS.includes(req.body.region))
    {
        //https://stackoverflow.com/questions/35864088/how-to-send-error-http-response-in-express-node-js/35865605
        console.log("Error, Illegal region name" + req.body.summoner);
        return res.status(400).json({ error: 'Illegal region name' });
    }
    //Check if Summoner Name is valid
    if(/^[0-9A-Za-z _.]+$/.test(req.body.summoner))
    {
        var summonerStats = {
            'summonerName': 'Eliptic',
            'summonerLevel': 100,
            'summonerId': '0FE2Reef7J9rMAU10ym9cQoJDxO5FCx7riMmsfsAPN4',
            'accountId': 'ty59yCxqwU_gzYXfbWWKii-NUFQ07apz3Fyh6RDFhA'
        };
        summonerStats['championMasteryList'] = [];
        summonerStats.championMasteryList.push({
                'championId': 81,
                'championLevel': 5,
                'championPointsUntilNextLevel': 0
        });
        summonerStats.championMasteryList.push({
            'championId': 98,
            'championLevel': 5,
            'championPointsUntilNextLevel': 0
        });
        summonerStats.championMasteryList.push({
            'championId': 141,
            'championLevel': 5,
            'championPointsUntilNextLevel': 0
        });
        summonerStats.championMasteryList.push({
            'championId': 102,
            'championLevel': 5,
            'championPointsUntilNextLevel': 0
        });
        summonerStats.championMasteryList.push({
            'championId': 203,
            'championLevel': 5,
            'championPointsUntilNextLevel': 0
        });
        summonerStats.championMasteryList.push({
            'championId': 13,
            'championLevel': 4,
            'championPointsUntilNextLevel': 1724
        });
        summonerStats.championMasteryList.push({
            'championId': 5,
            'championLevel': 4,
            'championPointsUntilNextLevel': 1736
        });
        summonerStats.championMasteryList.push({
            'championId': 67,
            'championLevel': 4,
            'championPointsUntilNextLevel': 3091
        });
        summonerStats.championMasteryList.push({
            'championId': 121,
            'championLevel': 4,
            'championPointsUntilNextLevel': 3689
        });
        summonerStats.championMasteryList.push({
            'championId': 20,
            'championLevel': 4,
            'championPointsUntilNextLevel': 3974
        });

        summonerStats['leagueEntryList'] = [];
        summonerStats['leagueEntryList'].push({
            'leagueId': "2a3e6690-457a-11e9-8d57-c81f66cf2333",
            'queueType': 'RANKED_SOLO_5x5',
            'wins': 101,
            'loss': 108,
            'hotStreak': false,
            'tier': 'PLATINUM',
            'rank': 'IV',
            'leaguePoints': 68
        });

        //Structure of summonerStats at the end: asdf
        /*
        summonerStats = {
            'summonerName': string,
            'summonerLevel': int,
            'summonerId': 'int',
            'accountId': 'int',
            'championMasteryList': [
                'championId': long,
                'championLevel': int,
                'championPointsUntilNextLevel': long
            ],
            'leagueEntryList': [
                'leagueId': string,
                'wins': int,
                'loss': int,
                'hotStreak': bool,
                'rank': string,
                'leaguePoints': int
            ],
            'matches': [
                'matchId': long,
                'championId': long,
                'kills': int,
                'deaths': int,
                'win': bool
            ]
        }
        */
        res.send(summonerStats);
    }
    else
    {
        console.log("Error, Illegal character in Summoner Name: " + req.body.summoner)
        return res.status(400).json({ error: 'Illegal character in Summoner Name' });
    }
});


//Post request, submit button - still do checks
app.post('/submit', (req, res) => {
    //https://developer.riotgames.com/regional-endpoints.html
    //Check if get parameters exist and Service region passed in is valid
    if(!SERVICE_REGIONS.includes(req.body.region))
    {
        //https://stackoverflow.com/questions/35864088/how-to-send-error-http-response-in-express-node-js/35865605
        console.log("Error, Illegal region name" + req.body.summoner)
        return res.status(400).json({ error: 'Illegal region name' });
    }
    //Check if Summoner Name is valid
    if(/^[0-9A-Za-z _.]+$/.test(req.body.summoner))
    {
        var platformIndex = SERVICE_REGIONS.indexOf(req.body.region);
        var apiRequest = "https://" + SERVICE_PLATFORM[platformIndex] + ".api.riotgames.com/lol/";
        var summonerStats = {}; //Object that will contain the necessary stats to be displayed

        getSummonerByName(apiRequest, req.body.summoner).then(
            function(summonerObj) {
                console.log("Received: " + JSON.stringify(summonerObj));
                summonerStats['profileIconId'] = summonerObj.profileIconId;
                summonerStats['summonerName'] = summonerObj.name;
                summonerStats['SummonerLevel'] = summonerObj.summonerLevel;  //For display
                summonerStats['summonerId'] = summonerObj.id;                //Encrypted, for other API call
                summonerStats['accountId'] = summonerObj.accountId;          //Encrypted, for other API call

                //getChampionMastery
                getChampionMastery(apiRequest, summonerObj.id).then(
                    function(masteryObjList) {
                        console.log("Received: " + JSON.stringify(masteryObjList));
                        summonerStats['championMasteryList'] = [];
                        for(var masteryObj in masteryObjList){
                            summonerStats.championMasteryList.push({
                                'championId': masteryObj.championId,
                                'championLevel': masteryObj.championLevel,
                                'championPointsUntilNextLevel': masteryObj.championPointsUntilNextLevel
                            });
                        }
                    }
                ), 
                function(error) {
                    console.log(err);
                };

                //getLeagueEntries
                getLeagueEntries(apiRequest, summonerObj.id).then(
                    function(leagueEntriesSet) {
                        console.log("Received: " + JSON.stringify(leagueEntriesSet));
                        summonerStats['leagueEntryList'] = [];
                        for(var entry in leagueEntriesSet) {
                            summonerStats.leagueEntryList.push({
                                'leagueId': entry.leagueId,
                                'wins': entry.wins,
                                'loss': entry.losses,
                                'hotStreak': entry.hotStreak,
                                'rank': entry.rank,
                                'leaguePoints': entry.leaguePoints
                            });
                        }
                    }
                ), 
                function(error) {
                    console.log(err);
                };

                /* Uncomment if we need match data
                //Not sure how to get win/loss for each champion again?
                //After thinking, I guess it is from calling matchlist then individual matches (but rate limit on individual matches per 10 secs...)
                //This function gets a list of matches, each with a matchId, a championId, kills, deaths, win(True/False)
                getMatchList(apiRequest, summonerObj.accountId).then(
                    function(matchList) {
                        summonerStats.matches = [];
                        for(var matchId in matchList){
                            getMatch(apiRequest, matchId).then(
                                function(match) {
                                    var participantId = null;
                                    //participantIdentityDTO, get the participantId of the summoner for the match
                                    for(participant in match.participantIdentities) {
                                        if(participant.player.summonerId === summonerObj.id) {
                                            participantId = participant.participantId;
                                        }
                                    }

                                    if(participantId !== null)
                                    {
                                        var championId = -1;
                                        var kills = -1;
                                        var deaths = -1;
                                        var win = null
                                        //participantDTO, get the championId, win(True/ False) and k/d
                                        for(player in match.participants) {
                                            if(participantId === player.participantId) {
                                                championId = player.championId;
                                                for(stats in player.stats){
                                                    kills = stats.kills;
                                                    deaths = stats.deaths;
                                                    win = stats.win;
                                                }
                                            }
                                        }

                                        //Push record
                                        summonerStats.matches.push({
                                            'matchId': matchId,
                                            'championId': championId,
                                            'kills': kills,
                                            'deaths': deaths,
                                            'win': win
                                        });
                                    }
                                }
                            );
                        }
                    }
                ), 
                function(error) {
                    console.log(err);
                };
                */

                //Send object with gathered/ compiled summoner data to Frontend
                res.send(summonerStats);
            }
        ), function(err) {
            console.log(err);
        };
    }
    else
    {
        console.log("Error, Illegal character in Summoner Name" + req.body.summoner)
        return res.status(400).json({ error: 'Illegal character in Summoner Name'});
    }

});

//Wildcard for non-existent pages
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
var getLeagueEntries = function (apiBaseURI, summonerId) {
    console.log("executing getLeagueEntries");
    var reqURI = apiBaseURI + "league/v4/entries/by-summoner/" + summonerId  + "?api_key=" + APIKEY;

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
        console.log(data);
        return data; 
    }, function(err) {
        console.log(err); 
        return [];
    });

    return promise;
}

// Champion Mastery
var getChampionMastery = function(apiBaseURI, summonerId) {
    console.log("executing getChampionMastery");
    var reqURI = apiBaseURI + "champion-mastery/v4/champion-masteries/by-summoner/" + summonerId  + "?api_key=" + APIKEY;

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
        console.log(data);
        return data; 
    }, function(err) {
        console.log(err); 
        return [];
    });

    return promise;
}

//Summoner's win/loss for each Champion, get matchlist, get matches
//Get matchlist for current season (depends on constant)
var getMatchList = function(apiBaseURI, accountId) {
    console.log("executing getChampionMastery");
    var reqURI = apiBaseURI + "match/v4/matchlists/by-account/" + accountId  + "?api_key=" + APIKEY + "&season=[" + CURRENT_SEASON + "]";

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

//Get a match
var getMatch = function(apiBaseURI, matchId) {
    var reqURI = apiBaseURI + "match/v4/matches/" + matchId + "?api_key=" + APIKEY;

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

/* Stats to display according to features requirement; Reminder: 
-Summoner Win/Loss ratio (maybe with win, loss too) 
-Summoner's current win streak
-Summoner's current rank
-Summoner's win/loss for each Champion
-Summoner's Champion Mastery (lots of data to display, maybe narrow it down more(?))
*/
