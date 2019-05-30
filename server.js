/* JS file for the express backend server that will handle routing; Serve the static public files (images, css); receive post or get request and send responses appropriately */

/* Some resources:
    https://expressjs.com/en/starter/static-files.html
    https://www.codementor.io/codeforgeek/build-website-from-scratch-using-expressjs-and-bootstrap-du107sby7
*/


/* Keep a const variable that contains the LoL API private key, fill with placeholder and be careful to not commit and push it to github */


/* handle Get request for landing page (page for root route ('/') / Maybe can be a static http file in views/index.html and just sendFile that */

/* handle Get with attributes/ Post request with summoner ID (root route but post request?) */
/* Check SummonerID input validity (input length, invalid characters, etc.) */

/* Fail check results in bootstrap alert and stay on landing/ root page */ 
/* send request to LoL using API for the Summoner stats. If response is bad, e.g. no such SummonerID exist display alert textbox and stay on landing/ root page */


/* Success, save it to a global var so can be used by other routes(?). Redirect to '/summoner' route (or maybe '/<summonerID>' ?), send request to LoL using API for some stats required for one of the features, 
process data and send a text/html response. 
(Probably have a global var for each feature api request call so we can reuse data instead of making more API calls if its not feasible, 
If making multiple redudant API calls is ok, then we don't need to) */

/* ALTERNATE TO having /summoner or other routes: Just have a Get but with SummonerID parameter ('/?summonerID=xxxxxxxxx') then: */
/* use SummonerID as key/ index for JSON object containing the data, so other users who want to search the same summonerID can use the stored 'cache' instead of making extra
API calls */
/* So program flow will be: submit summonerID (Get with summonerID parameter), check if it exists in the storage keys, If not then perform API call, if API call fails do bootstrap alert popup
if API call success just respond and display the stats */



/* Include a input box to enter other ID/ return to landing page to input other ID, 
Include some buttons or tabs to send request for other summoner stat, send API request to LoL, process and send response */

/* Stats to display according to features requirement; Reminder: 
-Summoner Win/Loss ratio (maybe with win, loss too) 
-Summoner's current win streak
-Summoner's current rank
-Summoner's win/loss for each Champion
-Summoner's Champion Mastery (lots of data to display, maybe narrow it down more(?))

First 4 might be able to be displayed in the summoner stat page
Champion Mastery might need its own request/ response to display
*/

/* About Us page if you want, need to add the static page file if so */

/* 404 wildcard route ('*'), sendFile a static html page in views/404.html as response, description of page in that file */