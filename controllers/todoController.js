var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var mongoose = require('mongoose');
mongoose.Promise = global.Promise; // use native mongoose promises﻿

//connect to the database
mongoose.connect('mongodb://test:test@ds127132.mlab.com:27132/task-manager');

//create schema (blueprint for data)
var todoSchema = new mongoose.Schema({
	item: String
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports = function(app) {
	app.get('/todo', function(req, res) {
		//get data from MongoDB and pass it to the view
		Todo.find({}, function(err, data){
			if (err) throw err;
			res.render('todo', {todos: data});
		});
	});

	app.post('/todo', urlencodedParser, function(req, res) {
		//get data from the view and add it to MongoDB
		var newTodo = Todo(req.body).save(function(err, data) {
			if (err) throw err;
			res.json(data);
		})
	});

	app.delete('/todo/:item', function(req, res) {
		//delete the requested item from MongoDB
		Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data) {
			if (err) throw err;
			res.json(data);
		})
	});
};