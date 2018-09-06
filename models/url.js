const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const urlShortnerSchema = new Schema({
    Title: {
        type: String,
        required: true
    },
    OriginalUrl: {
        type: String,
        required: true
    },
    Tags: {
        type: [String],
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    HashedUrl: {
        type: String
    },
    click: {
        clickedDateAndTime: {
            type: String
        },
        userIpAddress: {
            type: String
        },
        browser: {
            type: String
        },
        os: {
            type: String
        },
        device: {
            type: String
        }
    }
})

const urls = mongoose.model('urls', urlShortnerSchema);

module.exports = {
    urls
}