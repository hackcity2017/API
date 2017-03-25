/**
 * Created by remirobert on 25/03/2017.
 */
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const Alert = require('./alert');
const Device = require('./device');
const Informations = require('./informations');

mongoose.connect('mongodb://localhost/cityhacker');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/informations', function(req, res) {
    console.log(req.headers.identifier);
    console.log(req.body);
    const body = req.body;
    const deviceId = req.device;

    if (!deviceId) {
        res.status(401).send('No device id');
        return;
    }
    Device.find({id: deviceId}, function(err, deviceFound) {
        if (err || !deviceFound) {
            res.status(404).send('device not found');
            return;
        }
        const infos = Informations({
            device: deviceFound,
            temperature: body.temperature,
            humidity: body.humidity
        });
        infos.save(function(err) {
            if (err) {
                res.status(500).send('Error server');
                return;
            }
            res.status(200).send(infos);
        });
    });

});

app.post('/record', function(req, res) {
    console.log(req.headers.identifier);
    console.log(req.body);

    const body = req.body;
    const deviceId = body.deviceId;
    if (!deviceId) {
        res.status(401).send('No device id');
        return;
    }
    Device.find({id: deviceId}, function(err, deviceFound) {
        if (err || !deviceFound) {
            res.status(404).send('device not found');
            return;
        }
        const alert = new Alert({
            device: deviceFound,
            accelerometer: {
                x: body.accelx,
                y: body.accely,
                z: body.accelz
            }
        });
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