/**
 * Created by remirobert on 25/03/2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Device = new Schema({
    id: {type: String, required: true},
    createdAt: {
        type: Date,
        default: Date.now
    },
    name: {type: String}
});

module.exports = mongoose.model('Alert', Device);