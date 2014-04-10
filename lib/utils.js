const path = require('path');
const file = require('fs-utils');
const _ = require('lodash');
const toString = Object.prototype.toString;


exports.type = function(val) {
  return toString.call(val).toLowerCase().replace(/\[object ([\S]+)\]/, '$1');
}

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

var detectPattern = exports.detectPattern = function(str) {
  var re = /:([\S]+)/;
  if (re.test(str)) {
    return str.match(re)[1];
  }
};

var pathObject = function(filepath) {
  var extname = path.extname(filepath);
  var basename = path.basename(filepath, extname);
  var dirname = file.lastDir(filepath);

  return {
    extname: extname,
    basename: basename,
    dirname: dirname
  }
};

exports.normalizeNL = function(files) {
  return files.map(function(filepath) {
    return filepath.replace(/\\/g, '/');
  });
};

exports.namespaceFiles = function(arr, name) {
  var files = [];

  _.forEach(arr, function(filepath) {
    var filename = pathObject(filepath)[name];
    files = files.concat({name: filename, src: filepath});
  });
  return files;
};

exports.namespaceObject = function(arr, objName, options) {
  var name = {}, data = {}, len = arr.length;

  for (var i = 0; i < len; i++) {
    var filepath = arr[i];
    name[objName] = file.readDataSync(filepath);
    _.extend(data, name);
  }
  return data;
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
