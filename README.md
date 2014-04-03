theograph
=========

D3 Theograph 

This is a very simple experimental app to use D3 to render a 'gods eye' view of patient events, allowing 
a user to focus in on certain periods of time. 

To create this project, I used the tutorial on http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/ as a rough guide.
I started with a theograph renderer created for display in a simple web page. 
This has now been updated as a node.js application, using a mongodb database and using Jade for UI templating.
To run this locaaly you'll need the following installed:

1. Node.js - see the node website at http://nodejs.org/
2. Express - this is a framework that takes Node from a barebones application and turns it into something that behaves 
more like web servers we're used to. In a command prompt, cd to the directory in which node has been installed and 
run:

npm install -g express

3. mongodb - download the appropriate zip from http://mongodb.org/ and place the bin folder in the zip to a known location. 

I haven't included any database files in the repository but it is very easy to create a database. 
There is an empty data folder in the project. Navigate to the mongo bin folder in a command prompt, 
and type the following:

mongod --dbpath <path to the data folder>

This will set the mongo database location. To create the database, open a second command prompt and navigate to the mongodb installation directory. 
Type: mongo

This will open a mongo session. Type:

use nodetest1

This will create the nodetest1 database. Data can be added from the mongo session, but I've added a page that will let you add data
There are currently four fields:
 - type (the type of event)
 - specialty-name (the sepcialty the event applies to)
 - start ( the start date of the event)
 - end (the end date of the event)
 
To start the app and add data, navigate to the theograph folder on a command line and type:

node app.js

You should get a message like this:

Express server listening on port 3000

Now you should be able to open a browser at http://localhost:3000/theograph/newevent. 
At the moment you will need to add at least two events for the theograph to render. 
Date needs to be entered in the format yyyy-mm-dd 

There is an imagemap file in the theograph\public\images called image_maps_small, which maps an image in the images folder to 
a type of event. 

Once data is added, you should see a theograph at http://localhost:3000/theograph/theograph





