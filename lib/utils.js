const path = require('path');
const file = require('fs-utils');
const replace = require('frep');
const _ = require('lodash');
const toString = Object.prototype.toString;


/**
 * Utils
 */

exports.type = function(val) {
  return toString.call(val).toLowerCase().replace(/\[object ([\S]+)\]/, '$1');
};

exports.arrayify = function(arr) {
  return !Array.isArray(arr) ? [arr] : arr;
};

exports.normalizeNL = function(files) {
  return files.map(function(filepath) {
    return filepath.replace(/\\/g, '/');
  });
};

var normalized = {__normalized__: true};
exports.isNormalized = function(arr) {
  return arr.map(function(obj) {
    return _.extend(normalized, obj);
  });
};

exports.pathObject = function(filepath) {
  return {
    extname: path.extname(filepath),
    basename: file.name(filepath),
    dirname: file.lastDir(filepath)
  };
};

exports.typeInArray = function(value) {
  return value.map(function(item) {
    return exports.type(item);
  })[0];
};

exports.detectPattern = function(str) {
  var re = /:([\S]+)/;
  if (re.test(str)) {
    return str.match(re)[1];
  }
};

exports.renameProp = function(str, filepath) {
  var replacements = {
    ':basename': file.name(filepath),
    ':dirname': file.lastDir(filepath)
  };
  return replace.strWithObj(str, replacements);
};

exports.expandMatches = function(str, options) {
  var patterns = _.cloneDeep(str);
  var data = {};
  exports.arrayify(patterns).map(function(pattern) {
    var files = file.expand(pattern, options);
    if (files.length === 0) {
      _.extend(data, {nomatch: [pattern]});
    } else {
      _.extend(data, {src: files});
    }
  });
  return data;
};


/**
 * Array/object utils
 */


exports.extend = function (obj) {
  var args = Array.prototype.slice.call(arguments, 1);
  for (var i = 0, orig; orig = args[i]; i++) {
    if (!orig) {
      continue;
    }
    for (var prop in orig) {
      obj[prop] = orig[prop];
    }
  }
  return obj;
};

// http://jsperf.com/flattenarray
exports.flatten = function(arr) {
  do {
    arr = [].concat.apply([], arr);
  } while(arr.some(Array.isArray));
  return arr;
};

exports.flattenObject = function(obj) {
  var flattened = {};
  var len = obj.length;
  for (var i = 0; i < len; i++) {
    for (var entry in obj[i]) {
      flattened[entry] = obj[i][entry];
    }
  }
  return flattened;
};

exports.formatAsArray = function(obj) {
  var arr = [];
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      arr = arr.concat(obj[i]);
    }
  }
  return arr;
};

