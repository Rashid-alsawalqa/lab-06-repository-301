'use strict';

require('dotenv').config();

const express = require('express');

const cors = require('cors');

const PORT = process.env.PORT || 5555;

const server = express();

server.use( cors() );

server.get('/location', (request, response) => {
    const locationData = require('./data/geo.json');
    let location = new Location('lynwood', locationData);
    response.status(200).send(location);
});

function Location(city, locationData) {
    this.formatted_query = locationData[0].display_name;
	this.search_query = city;
	this.latitude = locationData[0].lat;
	this.longitude = locationData[0].lon;
}

function Weather(summary, time) {
    (this.forecast = summary), (this.time = time);
    Weather.all.push(this);
}
Weather.all = [];

server.get('/weather', (request, response) => {
    const weatherData = require('./data/darksky.json');
    let data = weatherData.daily.data;

    for (let i = 0; i < data.length; i++) {
        let date = new Date(data[i].time * 1000).toDateString();
        let forecast = data[i].summary;
        new Weather(forecast, date);
    }
    response.send(Weather.all);
    Weather.all = [];
});


server.use('*', (request, response) => {
    response.status(404).send('Not found');
});

server.use( (error,request, response) =>{
    response.status(500).send('error');
});

server.listen( PORT ,() => console.log(`App listening on ${PORT}`));