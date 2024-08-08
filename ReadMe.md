## Github repo - https://github.com/aaronboyd95/taylor-swift-express-app

### Local Setup
Setup Instructions for express app & swagger documentation
1. cd into `express-project`
2. run `yarn install`
3. run `yarn start`
4. This will load a node js express application on `http://localhost:3000`

Swagger Docs (API Documentation)
1. cd into `swagger-ui`
2. run `npm install`
3. run `npm run dev`
This may take a minute to install / start.
Once started, this will run on `http://localhost:3200`

Once both have deployed, you can navigate to `http://localhost:3200` and begin using the APIs.
Each API within the drop down comes with its own description and available fields.


`***`


### Hosted Express API
I have been able to utilise a free tier on a company called `https://render.com/` for hosting my API.
This can be accessed via: `https://taylor-swift-express-app.onrender.com/`

Swagger UI was not able to be hosted their due to memory constraints. 
You can however point your localhost swagger UI to the hosted version of the API by selecting the `Servers` dropdown 
at the top left of the swagger UI and selecting `https://taylor-swift-express-app.onrender.com/`.

## NOTE: As this is free tier the first request may take a while (Up to 60sec). As it spins down with inactivity.

Potential Improvements:
* Add additional error handling
* Add some basic authentication
* Spend more time to clean up the format of returned data
* Migrating to a db such as mongo or dynamo for larger datasets
* Add some basic API tests