var fs = require('fs'),
    PNG = require('pngjs').PNG,
    lsbTools = require('lsbtools');

fs.createReadStream('out.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {
        options = {
            shuffle: true, // spread data across image instead of writing sequentially
            matrix: true, // use matrix encoding to minimize changes
            mask: true, // mask data with stream of random bytes
            key: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], // array of bytes used as key for shuffling and masking
            pm1code: true  // use ±1 encoding instead of LSB flip
        };
        
        a = lsbTools.read(this['data'], options)
        console.log(a)
        
        this.pack().pipe(fs.createWriteStream('out.png'));
    });
