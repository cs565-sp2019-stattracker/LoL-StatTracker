# LoL-StatTracker

## Local deploy
1 Enter `npm start` in cmd/ terminal
2 Should start in port 8080, change port in index.js if port is used (e.g. to 8081) 
3 Ctrl+C to terminate

## Remote deploy - windows
1 Create Google Platform Project on google cloud, name of project will be the default domain name of the express app
2 Install google cloud SDK - Make sure to select `Start Google Cloud SDK Shell` and Run `gcloud init` at the end of the setup process
3 Open a Google Cloud SDK Shell
4 Navigate to local repo location and enter `gcloud app deploy`

## Remote deploy - Linux
1 https://cloud.google.com/sdk/docs/quickstart-linux
2 `Do Before You Begin` and `Initialize the SDK` sections
3 Open a terminal instance
4 Navigate to local repo location and enter `gcloud app deploy`

#Remote deploy - macOS
1 https://cloud.google.com/sdk/docs/quickstart-macos
2 `Do Before You Begin` and `Initialize the SDK` sections
3 Open a terminal instance
4 Navigate to local repo location and enter `gcloud app deploy`