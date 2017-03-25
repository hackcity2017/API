const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Alert = new Schema({
    device: { type: Schema.Types.ObjectId, ref: 'Device' },
    createdAt: {
        type: Date,
        default: Date.now
    },
    gyroscope: {
        x: {type: Number},
        y: {type: Number},
        z: {type: Number}
    },
    accelerometer: {
        x: {type: Number},
        y: {type: Number},
        z: {type: Number}
    }
});

module.exports = mongoose.model('Alert', Alert);