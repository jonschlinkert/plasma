const file = require('fs-utils');
const _ = require('lodash');
const plasma = require('./');
const utils = require('./lib/utils');


var fn = plasma.load('test/fixtures/fn/*.js');
var fn = plasma.load({name: 'plugins', src: ['test/fixtures/fn/*.js']});
var fn = plasma.load(['test/fixtures/fn/*.js']);
var fn = plasma.load([{name: 'plugins', src: ['test/fixtures/fn/*.js']}]);
// console.log(fn);





// file.writeJSONSync('tmp/i18n.json', i18n);
// file.writeJSONSync('tmp/data.json', data);
// file.writeJSONSync('tmp/pages.json', pages);

