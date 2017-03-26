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

const http = require('http').Server(app);
const io = require('socket.io')(http);

var connections = {};

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/informations', function(req, res) {
    const body = req.body;
    const deviceId = req.headers.identifier;

    if (!deviceId) {
        res.status(401).send('No device id');
        return;
    }
    Device.findOne({id: deviceId}, function(err, deviceFound) {
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

app.post('/alertStop', function(req, res) {
    console.log(req.body);
    res.status(200).send('No device id');

    const socket = connections["test"];
    if (socket) {
        socket.emit("test-alert-stop", { hello: 'world' });
    }
});

app.post('/alert', function(req, res) {
    console.log(req.body);
    const body = req.body;
    const deviceId = req.headers.identifier;
    if (!deviceId) {
        res.status(401).send('No device id');
        return;
    }
    Device.findOne({id: deviceId}, function(err, deviceFound) {
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
        const socket = connections["test"];
        if (socket) {
            socket.emit("test-alert", { hello: 'world' });
        }
        res.status(200).send(alert);
    });
});

app.post('/device', function(req, res) {
    const deviceId = req.body.deviceId;
    const name = req.body.name;

    if (!deviceId) {
        res.status(401).send('bad arguments');
        return;
    }
    Device.findOne({id: deviceId}, function(err, device) {
        if (err) {
            res.status(500).send('Error server');
            return;
        }
        if (device) {
            res.status(200).send(device);
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
        });
    });
});

io.set('authorization', function (handshakeData, accept) {
    if (handshakeData.headers) {
        const headers = handshakeData.headers;
        const deviceId = headers["device-id"];
        if (!deviceId) {
            accept(null, false);
            return;
        }
        accept(null, true);
    }
    else {
        accept(null, false);
    }
});

io.on('connection', function(socket) {
    const headers = socket.handshake.headers
    const deviceId = headers["device-id"];
    console.log("connection device : " + deviceId["device-id"]);
    if (deviceId) {
        connections[deviceId] = socket;
    }
    console.log('a user connected : ' + deviceId);
     io.on('disconnect', function(socket) {
        console.log("disconnect");
    });
});

app.get('/', function(req, res) {
    return res.json("cityhack17 API");
});

http.listen(4242, "0.0.0.0");
