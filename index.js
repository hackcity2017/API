/**
 * Created by remirobert on 25/03/2017.
 */
const mongoose = require('mongoose');
const express = require('express');

const Record = require('./alert');
const Device = require('./device');
const Informations = require('./informations');

mongoose.connect('mongodb://localhost/test');

const app = express();

app.post('/record', function(req, res) {
    console.log(req.bodye);

    const body = req.body;
    const deviceId = body.deviceId;
    if (!body.deviceId) {
        res.status(401).send('No device id');
        return;
    }

    Device.find({id: deviceId}, function(err, device) {
        if (!device) {
            res.status(404).send('device not found');
            return;
        }
    });
});

app.post('/createDevice', function(req, res) {
    const deviceId = req.body.deviceId;
    const name = req.body.name;

    if (!deviceId || !name) {
        res.status(401).send('bad arguments');
        return;
    }
    var device = new Device({
        id: deviceId,
        name: name
    });
    device.save(function(err) {
        if (err) {
            res.status(500).send('Error server');
            return;
        }
        res.status(200).send(device);
    })
});

app.get('/', function(req, res) {
    return res.json("cityhack17 API");
});

app.listen("4242", function() {
    console.log('server running ...');
});