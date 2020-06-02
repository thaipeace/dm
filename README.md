# DeviceManagementUI

## Require:
1. NodeJs with latest version from https://nodejs.org/en/
2. Install npm and bower for builder, run code: npm install -g gulp-cli bower

## Location:
Navigate to the root folder of project.

## Install plugin:
1. Run code: ```npm install```
2. Run code: ```bower install```

## Build & deploy on develop environment
1. Be sure port 4200 is free.
2. Run code: ```ng build```
3. Run code: ```ng serve --open```
4. Build: ```ng build --base-href=.```

==============================================

## How to deploy to server:
1. Start with the development build, run code: 

    ```ng build --prod --base-href=.```

2. Copy everything within the output folder dist to a folder on the server.
3. Configure the server to redirect requests for missing files to index.html.
