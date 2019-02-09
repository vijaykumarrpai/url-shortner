const mongoose = require('mongoose'); 
const sh = require('shorthash');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema; 

const urlSchema = new Schema({

    title: {
        type:String,
        required:true,
        min: 5
    },

    originalUrl: {
        type:String,
        required:true,
        minlength: 10
    },

    tags: { 
        type: [String],
        required: true,
        minlength: 1
    },
    hashedUrl: {
        type: String
    },
    createdAt:{
        type: Date, 
        default: Date.now
    },
    clicks: [
        {
            clickedDateAndTime: {
            type: Date,
            default: Date.now
        },
        ipAddress: {
            type: String
        },
        browserName: {
            type: String
        },
        osType: {
            type: String
        },
        deviceType: {
            type: String
        }
    }
    ]
});

urlSchema.pre('save', function(next) {
    let url = this;
    url.hashedUrl = sh.unique(url.originalUrl);
    url.createdAt = Date.now();
    next();
});

const Url = mongoose.model('Url', urlSchema); 

module.exports = {                            
    Url 
};