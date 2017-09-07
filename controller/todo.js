/**
 * Created by milad on 7/7/2017.
 */

//Models Section
var Todo = require('../models/todo');


//mongoose Methods
module.exports.addNewTodo = function (msg, callback) {
    if (!msg.text.slice(5)) {
        callback("please pass a content for new Todo");
    } else {
        new Todo({
            userId: msg.chat.id,
            content: msg.text.slice(5),
            creationTime: new Date().getTime()
        }).save(function (err, todo, count) {
            if (err) {
                callback("Error");
                throw err;
            } else
                callback("added");
        });
    }
};


//create a String for show all Todo
module.exports.getAllTodo = function (msg, callback) {
    var sortedTodoList = "Your Todos:" + "\n";
    var todoList = [];
    Todo.find({
        'userId': msg.chat.id
    }, function (err, todos) {
        if (err) throw err;
        else {
            todos.forEach(function (todo) {
                todoList.push(todo)
            });
            // sort TodoList
            var i = 1;
            todoList.sort(sorting);
            todoList.forEach(function (todo) {
                console.log(todo);
                sortedTodoList += "\n" + i + "- " + todo.content;
                i++;
            });
            console.log(sortedTodoList);
            callback(sortedTodoList);
        }
    });
};


/**
 * delete Todo by index
 * @param msg message (msg)
 */
module.exports.deleteTodo = function (msg, callback) {
    var index = msg.text.slice(8);
    if (isNaN(index) || index === "") {
        callback("please pass index to delete Todo");
    } else {
        var todoList = [];
        Todo.find({
            'userId': msg.chat.id
        }, function (err, todos) {
            if (err) throw err;
            else {
                todos.forEach(function (todo) {
                    todoList.push(todo);
                });
                if (todoList.length == 0) {
                    callback("There is no Todo to delete");
                } else {
                    if (index > todoList.length) {
                        callback("There is no Todo with passed number");
                    } else {
                        todoList.sort(sorting);
                        index = index - 1;
                        var targetId = todoList[index]._id;
                        Todo.findOne({
                            'userId': msg.chat.id,
                            '_id': targetId
                        }, function (err, delTodo) {
                            if (err) throw err;
                            else {
                                console.log(delTodo);
                                Todo.remove({
                                    '_id': delTodo._id
                                }, function (err, result) {});
                            }
                        });
                        callback("deleted");
                    }
                }
            }
        });
    }
}


//Ascending sort
function sorting(a, b) {
    if (a.creationTime < b.creationTime)
        return -1;
    if (a.creationTime > b.creationTime)
        return 1;
    return 0;
};