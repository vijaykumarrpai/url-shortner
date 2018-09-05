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

    }
})