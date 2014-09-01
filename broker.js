var express = require('express');

var PORT = process.env.PORT || 80;

var TYPE = {
    'queue': 'queue',
    'topic': 'topic'
}

var ClientPool = function() {
    this.clients = {};
    for(var type in TYPE) {
	this.clients[TYPE[type]] = {};
    }    
}

ClientPool.prototype.addClient = function(type, name, client) {
    if (this.clients[type][name]) {
        this.clients[type][name].push(client);
    } else {
        this.clients[type][name] = [client];
    }
}

ClientPool.prototype.length = function(type, name) {
    if (!this.clients[type][name]) {
	return 0;
    }
    return this.clients[type][name].length;
}

ClientPool.prototype.isEmpty = function(type, name) {
    if (!this.clients[type][name]) {
	return true;
    }
    return this.clients[type][name].length === 0;
}


ClientPool.prototype.notifyOne = function(type, name, body) {
    var self = this;
    
    function _notifyOne() {
	try {
	    var client = self.clients[type][name].shift();
	    client.contentType('application/json');
	    client.send(body);
	    return true;
	} catch(ex) {
	    return false;
	}
    
    }
    while (!this.isEmpty(type, name)) {
	if (_notifyOne()) {
	    break;
	}
    }
}

ClientPool.prototype.notifyAll = function(type, name, body) {
    while(!this.isEmpty(type, name)) {
	this.notifyOne(type, name, body);
    }
}

var clients = new ClientPool();


var app = express();
app.set('port', PORT)
app.use(express.bodyParser());

app.get('/', function(request, response) {
    response.send('Heroku Bus server is running at :' + PORT);    
});

app.get('/:type/:name', function(request, response) {
    var type = TYPE[request.params.type];
    if (!TYPE[type]) {
	return response.send(400);
    }
    var name = request.params.name;
    clients.addClient(type, name, response);
});

app.post('/:type/:name', function(request, response) {
    var type = TYPE[request.params.type];
    if (!TYPE[type]) {
	return response.send(400);
    }    
    var name = request.params.name;
    switch (type) {
	case TYPE.queue:
	    clients.notifyOne(type, name, request.body);
	    break;
	case TYPE.topic:
	    clients.notifyAll(type, name, request.body);
	    break;
    }
    response.send(200);
});


app.listen(PORT, function() {
    console.log('Heroku Bus server is running at :' + PORT)
});