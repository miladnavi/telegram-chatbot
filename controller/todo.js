/**
 * Created by milad on 7/7/2017.
 */

//Models Section
var Todo = require('../models/todo');

//mongoose Methods
module.exports.addNewTodo = function (msg) {
    new Todo({
        userId:msg.chat.id,
        content: msg.text.slice(5),
        creationTime: new Date().getTime()
    }).save(function (err, todo, count) {
       if(err) throw err;
    });
};

//create a String for show all Todo
module.exports.getAllTodo = function (todoList, sortedTodoList) {
    var i = 1;
    todoList.sort(sorting);
    todoList.forEach(function (todo) {
        console.log(todo);
        sortedTodoList += "\n" + i + "- " + todo.content;
        i++;
        console.log(sortedTodoList);
    });
    return sortedTodoList
};

module.exports.compare = function (a, b) {
    sorting(a,b);
};

//Ascending sort
function sorting (a, b) {
    if (a.creationTime < b.creationTime)
        return -1;
    if (a.creationTime > b.creationTime)
        return 1;
    return 0;
};


