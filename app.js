require('dotenv').config();

const express = require('express');
const app = express();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

//This is for EJS : 
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts)
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

  
// Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req,res) =>{res.render("home");})
//app.get("/home", (req,res) =>{res.render("home");})

app.listen(3000, 
    () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);

//Display results for the artist search
app.get('/artist-search',(req, res) => {
   spotifyApi
   .searchArtists(req.query.artist)
     .then(data => {
    console.log(data.body)
       console.log('The received data from the API: ', data.body.artists.items);
       const artistsInfo= data.body.artists.items
       // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
       res.render('artist-search-results', {artistsInfo})
     })
     .catch(err => console.log('The error while searching artists occurred: ', err));
    })

app.get('/albums/:artistId', (req, res) => {
    spotifyApi    
    .getArtistAlbums()
        .then(function(data) {
            console.log('Artist albums', data.body.artists.items);
            const artistsAlbums= data.body.artists.items
            res.render('albums', {artistsAlbums})
          })
          .catch(err => console.log('The error while searching artists occurred: ', err));
          })
        