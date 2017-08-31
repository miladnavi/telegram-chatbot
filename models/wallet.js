/**
 * Created by milad on 7/8/2017.
 */

var mongoose  = require('mongoose');
var Schema = mongoose.Schema();

var walletSchema = mongoose.Schema({
    userId: {
        type: Number
    },
    among: {
        type:Number
    },
    content: {
        type: String
    },
    creationTime: {
        type: Number
    },
    day:{
        type: Number
    },
    month:{
        type: Number
    },
    year: {
        type: Number
    }
});

mongoose.connect("mongodb://localhost/telegramDB");
var wallet = module.exports = mongoose.model('wallet', walletSchema);
