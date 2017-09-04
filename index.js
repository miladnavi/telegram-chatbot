/*
 Main App for Telegram API (created by Milad Navidizadeh)
 */

 /* TODO:
 * - Weather fix
 * - location (user input)
 * - wallet
 * - (code polish)
*/

//required parameters for bot
const TelegramBot = require('node-telegram-bot-api');
const token = '403310626:AAFRZEJu11sC376v3fmgmCYEOLAUEsYX9EE';
const bot = new TelegramBot(token, {polling: true});

//required  Methods and Library
var Weather = require('weather-js');
var controller = require('./controller/todo');
var weatherController = require('./controller/weather');
var mongoose = require('mongoose');
var Todo = require('./models/todo');

//mongoose settings and connection
var db = mongoose.connection;
db.on('error', function (err) {
    console.log('connection error', err);
});
db.once('open', function () {
    console.log('connected.');
});

//GeoCoder settings for location
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
};

var geocoder = NodeGeocoder(options);

//request and response Methods
bot.on('Location', (Msg) => {

    console.log(Msg.longitude);
});
bot.on('message', (msg) => {
    var Hi = "hi";
    var Location = "location";


    if (msg.text.toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(msg.chat.id, "Hello dear " + msg.chat.first_name)
    } else if (msg.text.toLowerCase().indexOf(Location) === 0) {

        geocoder.geocode('29 champs elysée paris', function (err, res) {
            console.log(res);
            bot.sendLocation(msg.chat.id, res[0].latitude, res[0].longitude);
            bot.sendMessage(msg.chat.id, "Here is the point");
        });

    } else if (msg.text.search("/add") === 0) {
        if (!msg.text.slice(5)) {
            bot.sendMessage(msg.chat.id, "please pass a content for new Todo");
        } else {
            controller.addNewTodo(msg);
            bot.sendMessage(msg.chat.id, "added");
        }
    } else if (msg.text.toLowerCase().indexOf("/get") === 0) {
        var sortedTodoList = "Your Todos:" + "\n";
        var todoList = [];
        Todo.find({'userId': msg.chat.id}, function (err, todos) {
            if (err) throw err;
            else {
                todos.forEach(function (todo) {
                    todoList.push(todo)
                });
                sortedTodoList = controller.getAllTodo(todoList, sortedTodoList);
                bot.sendMessage(msg.chat.id, sortedTodoList);
            }
        });
    } else if (msg.text.toLowerCase().indexOf("/delete") === 0) {
        var index = msg.text.slice(8);
        if (!index) {
            bot.sendMessage(msg.chat.id, "please pass index to delete Todo")
        } else {
            var todoList = [];
            Todo.find({'userId': msg.chat.id}, function (err, todos) {
                if (err) throw err;
                else {
                    todos.forEach(function (todo) {
                        todoList.push(todo);
                    });
                    if (todoList.length == 0) {
                        bot.sendMessage(msg.chat.id, "There is no Todo to delete")
                    } else {
                        if (index > todoList.length) {
                            bot.sendMessage(msg.chat.id, "There is no Todo with passed number");
                        } else {
                            todoList.sort(controller.compare);
                            index = index - 1;
                            var targetId = todoList[index]._id;
                            Todo.findOne({'userId': msg.chat.id, '_id': targetId}, function (err, delTodo) {
                                if (err) throw err;
                                else {
                                    console.log(delTodo);
                                    Todo.remove({'_id': delTodo._id}, function (err, result) {
                                    });
                                }
                            });
                            bot.sendMessage(msg.chat.id, "deleted");
                        }
                    }
                }
            });
        }
    } else if (msg.text.toLowerCase().indexOf("weather") === 0) {
        if (!msg.text.slice(8)) {
            bot.sendMessage("please pass the City or Country name")
        } else {
            Weather.find({search: msg.text.slice(8), degreeType: 'C'}, function (err, result) {
                if(err){
                    bot.sendMessage(msg.chat.id, "sorry, I can't find this Location");
                    console.log(err);
                }
                else if (result.length == 0) {
                    console.log("Hi")
                    bot.sendMessage(msg.chat.id, "sorry, I can't find this Location");
                } else {
                    console.log(result);
                    bot.sendMessage(msg.chat.id, weatherController.createWeatherReport(result));
                }
            });
        }
    }
});


//Handel pic message
bot.onText(/\/sendpic/, (msg) => {

    bot.sendPhoto(msg.chat.id, "https://ibb.co/dkvRza", {caption: "Here we go ! \nThis is just a caption "});

});

//Handel button message
bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome", {
        "reply_markup": {
            "keyboard": [["Location", "Weather"], ["I'm Robot"]]
        }
    });
});

