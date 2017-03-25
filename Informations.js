/**
 * Created by remirobert on 25/03/2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Informations = new Schema({
    device: { type: Schema.Types.ObjectId, ref: 'Device' },
    createdAt: {
        type: Date,
        default: Date.now
    },
    temperature: {type: Number},
    barometricPressure: {type: Number},
    humidity: {type: Number}
});

module.exports = mongoose.model('Informations', Informations);