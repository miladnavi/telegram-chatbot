/*
 * Main App for Telegram API (created by Milad Navidizadeh)
 */

/* TODO:
 * - wallet
 * - code polish
 */


// required parameters for bot
const TelegramBot = require('node-telegram-bot-api');
const token = '406242513:AAHJ4a4TnMf7OmVUuWhtQqLXRagfZ_w4mrE';
const bot = new TelegramBot(token, {
    polling: true
});


// required  Methods and Library
var todoController = require('./controller/todo');
var weatherController = require('./controller/weather');
var mongoose = require('mongoose');


// mongoose settings and connection
var db = mongoose.connection;
db.on('error', function (err) {
    console.log('connection error', err);
});
db.once('open', function () {
    console.log('connected.');
});


// GeoCoder settings for location
var NodeGeocoder = require('node-geocoder');
var options = {
    provider: 'google'
};
var geocoder = NodeGeocoder(options);


// Used to determine if bot should listen to default commands or to command-related things (like location for a weather report)
var botMode = "default";


// Main behaviour Tree
bot.on('message', (msg) => {
    switch (botMode) {
        case "weather":
            weatherBehaviour(msg);
            break;

        case "location":
            locationBehaviour(msg);
            break;

        case "default":
        default:
            defaultBehaviour(msg);
    }
});


// Handel pic message
bot.onText(/\/sendpic/, (msg) => {
    bot.sendPhoto(msg.chat.id, "https://ibb.co/dkvRza", {
        caption: "Here we go ! \nThis is just a caption "
    });
});

// Handel button message
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome", {
        "reply_markup": {
            "keyboard": [
                ["Location", "Weather"]
            ]
        }
    });
});


function defaultBehaviour(msg) {
    switch (true) {
        // Hi Response
        case msg.text.toLowerCase().indexOf("hi") === 0:
            bot.sendMessage(msg.chat.id, "Hello dear " + msg.chat.first_name);
            break;

            // 'location'
        case msg.text.toLowerCase().indexOf("location") === 0:
            bot.sendMessage(msg.chat.id, "Type in an Adress");
            botMode = "location";
            break;

            // '/add'
        case msg.text.toLowerCase().indexOf("/add") === 0:
            todoController.addNewTodo(msg, (info) => {
                bot.sendMessage(msg.chat.id, info);
            });
            break;

            // '/get'
        case msg.text.toLowerCase().indexOf("/get") === 0:
            todoController.getAllTodo(msg, (todos) => {
                bot.sendMessage(msg.chat.id, todos);
            });
            break;

            // '/delete'
        case msg.text.toLowerCase().indexOf("/delete") === 0:
            todoController.deleteTodo(msg, (info) => {
                bot.sendMessage(msg.chat.id, info);
            });
            break;

            // 'weather'
        case msg.text.toLowerCase().indexOf("weather") === 0:
            bot.sendMessage(msg.chat.id, "Please enter an Adress.");
            botMode = "weather";
            break;

            // unknown command
        default:
            bot.sendMessage(msg.chat.id, "Sorry, I didn't understand that :(");
    }
}


function weatherBehaviour(msg) {
    weatherController.sendWeatherInfo(msg.text, (weatherInfo) => {
        bot.sendMessage(msg.chat.id, weatherInfo);
    });
    botMode = "default";
}


function locationBehaviour(msg) {
    geocoder.geocode(msg.text, function (err, res) {
        console.log(res);
        bot.sendLocation(msg.chat.id, res[0].latitude, res[0].longitude);
        bot.sendMessage(msg.chat.id, "Here is the point");
    });
    botMode = "default";
}