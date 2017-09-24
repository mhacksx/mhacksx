var app = require('express')();
var express = require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')
var fs = require('fs'),
    PNG = require('pngjs').PNG,
    lsbTools = require('lsbtools');

var cookie = require('cookie');

server.listen(8000);

groups = []
groups.push({"Name":"esdfsd", "Key":[1,2,3,4,5,6,7,8,9,0]})

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].Name === nameKey) {
            return myArray[i];
        }
    }
}

function randomKey()
{
    array = []
    for(var x = 0; x <= 10; x++)
	{
        a = Math.floor(Math.random() * 10);
        array.push(a)
        
        if(x == 10)
			return array;
    }
}

app.post('/new', function (req, res) {
    console.log(req.body)
    
    if (search(req.body.groupname, groups) === undefined)
    {
        console.log("Adding group " + req.body.groupname)
        groups.push({"Name":req.body.groupname,"Key":randomKey()})
        res.send('Test', 200);
        res.end();
    } else
    {
        console.log("Group found key");
        res.send('Test', 200);
        res.end();
    }
    
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
    socket.on('out', function (data, key, emitTo) {
        if (key != null)
        {
            createImage("in.png", data, key, function(imageURL) {
                io.to(emitTo).emit('in', imageURL);
            });
        }
    });
    
    socket.on('getKey', function(data) {
        
        var cookies = cookie.parse(data);
        console.log(cookies)
        for (x = 0; x <= groups.length; ++x)
        {
            if (groups[x] !== undefined && groups[x].Name == cookies.tempcookie)
            {
                socket.join(cookies.tempcookie);
                socket.emit("gotInfo", cookies.tempcookie, groups[x].Key);
                break;
            }
            
            if (x == groups.length)
                socket.emit("gotInfo", null, null);
            
        }
        
        });
    
});
