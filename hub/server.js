var socketio = require('socket.io')
  , request = require('request');

var port = 4242;
var baseURL = 'http://ec2-23-20-226-159.compute-1.amazonaws.com/cyclops/roles/';

console.log('Starting Roles Server on ' + port);
console.log('REST URL: ' + baseURL);

var io = socketio.listen(port);

io.sockets.on('connection', function (socket) {
	console.log('got a connection');
    socket.on('getRoles', function() {
		console.log("Calling REST getRoles");
		request(baseURL, function (error, response, data) {
			if (!error && response.statusCode == 200) {
				console.log(data);
                socket.emit('setRoles', data);
			}
			else {
				console.log("error " + response);
                socket.emit('onError', response);			
			}
		});
	});
    
    socket.on('addRole', function(role) {
		console.log("Calling REST addRole");
		request.post({url:baseURL + 'Create',json:true,body: role}, function (error, response, data) {
        	if (!error && response.statusCode == 200) {
            	console.log("added " + data);
                io.sockets.emit('roleAdded', data);
			}
            else {
            	console.log("error " + response);
                socket.emit('onError', response);
			}
		});
	});
    
    socket.on('updateRole', function(role) {
		console.log("Calling REST updateRole");
		request.post({url:baseURL + 'Edit',json:true,body: role}, function (error, response, data) {
        	if (!error && response.statusCode == 200) {
            	console.log("updated " + data);
                io.sockets.emit('roleUpdated', data);
			}
            else {
            	console.log("error " + response);
                socket.emit('onError', response);
			}
		});
	});
    
    socket.on('deleteRole', function(id) {
		console.log("Calling REST deleteRole");
		request.post({url:baseURL + 'Delete/' + id}, function (error, response, data) {
        	if (!error && response.statusCode == 200) {
            	console.log("deleted " + id);
                io.sockets.emit('roleDeleted', id);
			}
            else {
            	console.log("error " + response);
                socket.emit('onError', response);
			}
        });
	});
});

process.on('uncaughtException', function(err) {
  console.log(err);
});

