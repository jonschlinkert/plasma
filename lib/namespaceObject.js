const file = require('fs-utils');
const _ = require('lodash');

module.exports = function(name, src, options) {
  options = options || {};
  name = exports.detectPattern(name);
  var hash = {}, data = {}, len = src.length;

  for (var i = 0; i < len; i++) {
    var filepath = src[i];
    if(options.expand && options.expand === false) {
      hash[name] = filepath;
    } else {
      hash[name] = file.readDataSync(filepath);
    }
    _.extend(data, hash);
  }

  return data;
};
