# TCBuildNazi
Simple page that shows the last build status of a TeamCity build configuration in glorious green (build succeeded) or red (build failed). 

Tested with TeamCity 2017.1.2 (build 46812)

Please note; only tested in Chrome

## Parameters

For the sake of simplicity, you can pass parameters in the query string. The following parameters are available:

| Parameter     	| Required      | Default value         | Description   |
| -----------------	| ------------- | ---------------------	| ------------- |
| tcBaseUrl     	| Yes 			| N/A 		    		| The base url of your TeamCity server	
| authToken     	| Yes 			| N/A 		    		| Auth token (base64 encoded username:password)
| buildConfigId     | Yes 			| N/A 		    		| The id of your build configuration
| projectName     	| No 			| TeamCity project name | The title to display on screen
| blame     		| No 			| false		    		| When set to true, the name of the committer who broke the build is displayed (in case of mulitple committers, the first one is displayed)
| showBuildTime     | No 			| false 		    	| When set to true, the build time will be displayed
| blink     		| No 			| false 		    	| When set to true, the name of the build breaker will blink	
| sad     			| No 			| false 		    	| When set to true, a sad trombone announces when the build gets broken

Disclaimer: the auth token can be decoded to reveal the username and password of your TeamCity account. Do not use on a public site without https. After entering the URL, the auth token is removed from the query string. Handle with care.

Example url:

`http://buildmonitor.yourcompany.com?tcBaseUrl=http://teamcity.yourcompany.com&projectName=MyAwesomeProject&buildConfigId=MyAwesomeBuildConfigId&authToken=exampleToken&blame=true&showBuildTime=true&blink=true&sad=true`

## TeamCity requirements

You must enable cross domain requests to your TeamCity server. In order to do so, go to the Administration area in TeamCity, then from the menu select Diagnostics. On the Diagnostics page, open the internal properties tab and click on 'Edit internal properties'. Enter the following values separated by a newline:

`rest.cors.optionsRequest.allowUnauthorized=true`

`rest.cors.origins=http://buildmonitor.yourcompany.com`

You might need to reboot TeamCity for the changes to take effect.

## Helpful links

**TeamCity Rest Api documentation**

https://confluence.jetbrains.com/display/TCD10/REST+API
