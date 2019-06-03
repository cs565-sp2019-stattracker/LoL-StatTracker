/* JS file for the express backend server that will handle routing; Serve the static public files (images, css); receive post or get request and send responses appropriately */

/* Some resources:
    https://expressjs.com/en/starter/static-files.html
    https://www.codementor.io/codeforgeek/build-website-from-scratch-using-expressjs-and-bootstrap-du107sby7
    https://cloud.google.com/community/tutorials/run-expressjs-on-google-app-engine
*/
var http = require('http');         //For making http requests using LoL API
const express = require('express'); 
const app = express();

const APIKEY = "<APIKEY HERE>" /* Note: Don't commit the APIKEY */
var viewPath = __dirname + '/views';
var publicPath = __dirname + '/public';
var summonerData = {};          //Store user data

app.use(express.static(publicPath));

app.get('/', (req, res) => {
    //If the query param with summonerName key exists, do stuff
    if(req.query.summonerName)
    {
        //Do API call (http get request)
        /* https://developer.riotgames.com/getting-started.html */

        /* Resource for the alert: https://stackoverflow.com/questions/52003021/node-js-express-request-fade-in-and-out-bootstrap-modal-on-request-error */
        //Callbacks, wrap in API call 
        //success callback
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
    }
    else //get with not summonerName param, send landing/ root/ home page
    {
        res.sendFile(viewPath + "index.html");
    }
});

//Wildcard for non-existant pages
app.get('*', (req, res) => {
    res.sendFile(viewPath + "404.html");
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});

/* ALTERNATE TO having /summoner or other routes: Just have a Get but with SummonerID parameter ('/?summonerID=xxxxxxxxx') then: */
/* use SummonerName as key/ index for JSON object containing the data, so other users who want to search the same summonerID can use the stored 'cache' instead of making extra
API calls */
/* So program flow will be: submit summonerID (Get with summonerID parameter), check if it exists in the storage keys, If not then perform API call, if API call fails do bootstrap alert popup
if API call success just respond and display the stats */

/* Stats to display according to features requirement; Reminder: 
-Summoner Win/Loss ratio (maybe with win, loss too) 
-Summoner's current win streak
-Summoner's current rank
-Summoner's win/loss for each Champion
-Summoner's Champion Mastery (lots of data to display, maybe narrow it down more(?))

First 4 might be able to be displayed in the summoner stat page
Champion Mastery might need its own request/ response to display
*/
