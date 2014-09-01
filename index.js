var express = require('express');

var PORT = process.env.PORT || 5000;

var app = express();
app.set('port', 80)

app.get('/', function(request, response) {
    response.send('Heroku Bus server is running at :' + PORT);    
});

app.listen(app.get('port'), function() {
    console.log('Heroku Bus server is running at :' + PORT)
});