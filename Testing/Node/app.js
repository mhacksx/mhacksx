var lsbTools = require('lsbtools');
var PNG_ = require('png-js');
var fs = require('fs');

PNG = require('pngjs').PNG;

var data = fs.readFileSync('a42.png');
var png = PNG.sync.read(data);
var options = { colorType: 6 };
var buffer = PNG.sync.write(png, options);

console.log(buffer);

PNG_.decode('a42.png', function(pixels) {
    console.log(pixels)
    
    options = {
            shuffle: true, // spread data across image instead of writing sequentially
            matrix: true, // use matrix encoding to minimize changes
            mask: true, // mask data with stream of random bytes
            key: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], // array of bytes used as key for shuffling and masking
            pm1code: true  // use ±1 encoding instead of LSB flip
        };
    
    b = lsbTools.write(pixels, [1,2,6,4,5], options)
    console.log(b)
    
    a = lsbTools.read(pixels, options)
    console.log(a)
    

});
