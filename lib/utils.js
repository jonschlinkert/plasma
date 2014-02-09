/**
 * Utils
 */

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
      arr.push(obj[i]);
    }
  }
  return arr;
};

exports.arrayify = function(arr) {
  arr = !Array.isArray(arr) ? [arr] : arr;
  return exports.flatten(arr);
};

