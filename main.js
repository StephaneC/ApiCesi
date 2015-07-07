var express = require('express');
var app     = express();
var redis = require('redis');
var crypto = require('crypto');

var http = require('http').Server(app);

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


var messages =[];
var users =[];
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;
var connectRedis = function(){
    console.log("connect");
    try {
        //if env var exist, user it
        if(port && host){
            client= redis.createClient(port, host);
        } else {
            //else give a try to default
            client = redis.createClient();
        }
        client.on("error", function (err) {
            console.log("Error " + err);
        });
    }catch(e){
        console.log("couldn't connect to redis Sub", e);
    }
};
connectRedis();


app.use(express.static('./html/docapi'));


app.post('/ping', function(req, res){
    res.setHeader('Content-Type', 'text/json');
    res.end('pong');
});

app.get('/hello', function(req, res){
    res.setHeader('Content-Type', 'text/json');
    console.log('hello '+req.param('name', null));
    res.end('hello '+req.param('name', null));
});

/** User part **/
app.post('/signup', function(req, res){
    var username = req.param('username', null);
    var pwd = req.param('pwd', null);
    console.log('signup '+username);
    if(!username || !pwd){
        res.status(400);
        res.send("error");
    } else {
        client.get(username, function(err, reply) {
            // reply is null when the key is missing
            if(reply == null){
                client.set(username, pwd);//TODO hash
                users.push(username);
                res.status(200);
                res.send();
            } else {
                res.status(401);
                res.send('user already exist');  
            }
        });
    }
});

app.post('/signin', function(req, res){
    var username = req.param('username', null);
    var pwd = req.param('pwd', null);
    console.log('signin ' + username);
    if(!username || !pwd){
        console.log('signin username||pwd null' + username +' || ' + pwd);
        res.status(400);
        res.send("error");
    } else {
        client.get(username, function(err, reply){
            if(reply != pwd){
                console.log('signin username||pwd null' + username +' || ' + pwd);
                res.status(401);
                res.send("error");  
            } else {
                crypto.randomBytes(48, function(ex, buf) {
                  var token = buf.toString('hex');
                    client.set(token, username);                    
                    res.status(200);
                    res.send('{"token":"'+token+'"}');
                });                
            }
        });
    }
});

app.get('/users', function(req, res){
    var token = req.header('token', null);
    client.get(token, function(err, reply){
        if(reply){
            res.status(200);
            res.send(JSON.stringify(users)); 
        } else {
            res.status(401);
            res.send('token invalid');
        }
    }); 
});



/** Tchat part **/

/**
 * add a message
 */
app.post('/messages', function(req, res){
    var token = req.header('token', null);
    console.log("message posted by token : " + token);
    console.log('post message '+JSON.stringify(req.body));
    client.get(token, function(err, name){ 
        var msg = req.body.message;
        if(name){
            var message = {
                username : name,
                date : new Date().getTime(),
                message: msg
            }
            messages.push(message); 
            res.status(200);
            res.send();
        } else {
            res.status(401);
            res.send('token invalid');
        }
    });  
    
});

/**
 * get all messages
 */
app.get('/messages', function(req, res){
    var token = req.header('token', null);
    client.get(token, function(err, reply){
        if(reply){
            res.status(200);
            res.send(JSON.stringify(messages)); 
        } else {
            res.status(401);
            res.send('token invalid');
        }
    }); 
});
    

/*
 * Handle 404.
 */
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

http.listen(8080, function(){
  console.log('listening on *:3000');
});