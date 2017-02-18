"use strict";

var fs = require("fs");
var sqlite3 = require("sqlite3");
var express = require('express');
var api = express();
var bodyParser=require('body-parser');
api.use(bodyParser.json());

var repo = "./blog.db";
fs.exists(repo, function(exists) {
	if (exists) {
		var db = new sqlite3.Database(repo);
		//var stmt = "SELECT post_id, title, body FROM posts";
		//db.each(stmt, function(err, row) {
			//console.log(row.post_id + " " + row.title + ", " + row.body);
		//});
		/*api.get('/post', function(req, res){
    			db.get("SELECT COUNT(*) AS value FROM posts", function(err, row){
        			res.json({ "count" : row.value });
    			});
		});*/

		api.post('/post', function(req, res){ 
			db.run("INSERT INTO posts (post_id, title, body) VALUES (?,?,?)", [req.body.post_id,req.body.title,req.body.body], function(e,r){
       				if (e==null)
					res.status(202).json({"id":this.lastID});
				else
					res.status(500).end();
			});
		});

		api.get('/posts', function (req, res) {
			db.all("SELECT * FROM posts", 
				function(e,r) { res.json(r); });
		});

		api.listen(31337);
		console.log("Submit a post using /post and get all the posts using /posts to");
	}
	else {
		console.log("Database does not exist.");
	}
});

