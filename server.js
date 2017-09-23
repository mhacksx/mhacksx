var app = require('express')();
var express = require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')
var fs = require('fs'),
    PNG = require('pngjs').PNG,
    lsbTools = require('lsbtools');
    
server.listen(8000);

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.post('/new', function (req, res) {
    console.log(req.body)
    res.end();
});

function generateHash()
{
	var hash = "";
	for(var x = 0; x <= 20; x++)
	{
		currentChar = Math.floor(Math.random() * 36);
		if(currentChar > 9)
			hash += String.fromCharCode(currentChar + 55);
		else
			hash += currentChar;
		
		if(x == 20)
			return hash;
	}
}

function createImage(inputImage, message, key, callback_)
{
    message = message.split("")
    
    for (x = 0; x < message.length; ++x)
        message[x] = message[x].charCodeAt()
    
    hash = generateHash();
    
    fs.createReadStream(inputImage)
        .pipe(new PNG({
            filterType: 4
        }))
        .on('parsed', function() {
            options = {
                shuffle: true, // spread data across image instead of writing sequentially
                matrix: true, // use matrix encoding to minimize changes
                mask: true, // mask data with stream of random bytes
                key: key, // array of bytes used as key for shuffling and masking
                pm1code: true  // use ±1 encoding instead of LSB flip
            };
            
            b = lsbTools.write(this['data'], message, options)
            stream = this.pack().pipe(fs.createWriteStream("./static/" + hash + '.png'))
            stream.on('finish', function() {callback_("/" + hash + '.png')});
    });
}

io.on('connection', function (socket) {
    socket.on('out', function (data) {
        createImage("in.png", data, [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], function(imageURL) {
            socket.emit('in', imageURL);
        });
    });
});