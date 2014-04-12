const file = require('fs-utils');
const arrayify = require('./utils').arrayify;
const _ = require('lodash');

module.exports = function(str, options) {
  var patterns = _.cloneDeep(str);
  var data = {};
  arrayify(patterns).map(function(pattern) {
    var files = file.expand(pattern, options);
    if (files.length === 0) {
      _.merge(data, {nomatch: [pattern]});
    } else {
      _.merge(data, {src: files});
    }
  });
  return data;
};
