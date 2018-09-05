const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const urlShortnerSchema = new Schema({
    title: {
        type: String
    },
    originalUrl: {
        type: String
    },
    tags: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    hashedUrl: {
        type: String
    }
})

const Url = mongoose.model('urls', urlShortnerSchema);

module.exports = {
    Url
}