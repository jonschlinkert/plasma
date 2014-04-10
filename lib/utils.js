const path = require('path');
const file = require('fs-utils');
const _ = require('lodash');
const toString = Object.prototype.toString;


/**
 * Utils
 */

exports.type = function(val) {
  return toString.call(val).toLowerCase().replace(/\[object ([\S]+)\]/, '$1');
};

exports.normalizeNL = function(files) {
  return files.map(function(filepath) {
    return filepath.replace(/\\/g, '/');
  });
};

exports.detectPattern = function(str) {
  var re = /:([\S]+)/;
  if (re.test(str)) {
    return str.match(re)[1];
  }
};

exports.pathObject = function(filepath) {
  return {
    extname: path.extname(filepath),
    basename: path.basename(filepath, path.extname(filepath)),
    dirname: file.lastDir(filepath)
  }
};

exports.namespaceFiles = function(arr, name) {
  var files = [];

  _.forEach(arr, function(filepath) {
    var filename = exports.pathObject(filepath)[name];
    files = files.concat({name: filename, src: [filepath]});
  });
  return files;
};


exports.namespaceObject = function(arr, objName, options) {
  options = options || {};
  var name = {}, data = {}, len = arr.length;

  for (var i = 0; i < len; i++) {
    var filepath = arr[i];
    if(!options.expand === false) {
      name[objName] = file.readDataSync(filepath);
    } else {
      name[objName] = filepath;
    }
    _.extend(data, name);
  }
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

exports.arrayify = function(arr) {
  return !Array.isArray(arr) ? [arr] : arr;
};
