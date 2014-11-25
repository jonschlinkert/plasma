'use strict';

var path = require('path');
var Plasma = require('./');
var plasma = new Plasma({cons: {a0: 'b0'}});

plasma.option('cwd', '.');
plasma.option('namespace', function(fp) {
  return path.basename(fp, path.extname(fp));
});


// plasma.load('.assemblerc.yml');
// plasma.load('foo', {bar: 'baz'});
// plasma.load('test/fixtures/*.json');
// plasma.load(['test/fixtures/*.yml', 'test/fixtures/nested/*.json']);
// plasma.load(['test/fixtures/*.yml', 'fofo']);
// plasma.load({blah: 'quux'});
// plasma.load({fez: 'bang'});

// console.log(plasma);


plasma.enable('namespace');
plasma.load(['test/fixtures/*.yml', 'test/fixtures/nested/*.json']);
plasma.disable('namespace');
plasma.load(['test/fixtures/*.yml', 'test/fixtures/nested/*.json']);

console.log(plasma);
