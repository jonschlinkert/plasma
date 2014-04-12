const file = require('fs-utils');
const plasma = require('../');
const utils = require('../lib/utils');
const _ = require('lodash');

var data = plasma.load({name: ':dirname', src: 'test/**/*.json'}).data;
var pages = plasma.load({name: ':basename', src: 'test/**/expected*.json'}).data;
var i18n = plasma.load({name: ':basename', src: 'test/fixtures/i18n/*.json'}).data;

file.writeJSONSync('tmp/i18n.json', i18n);
file.writeJSONSync('tmp/data.json', data);
file.writeJSONSync('tmp/pages.json', pages);


console.log(i18n);