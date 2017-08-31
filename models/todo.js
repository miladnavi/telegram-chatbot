/**
 * Created by milad on 7/1/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema();

var TodoSchema = mongoose.Schema({
    userId: {
      type: Number
    },
    content: {
        type: String
    },
    creationTime: {
        type: Number
    }
});
mongoose.connect('mongodb://localhost/telegramDB');

var Todo = module.exports = mongoose.model('Todo', TodoSchema);

