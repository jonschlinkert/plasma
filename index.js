/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const path = require('path');
const file = require('fs-utils');
const glob = require('globule');
const expander = require('expander');
const expandHash = require('expand-hash');
const log = require('verbalize');
const _ = require('lodash');

const utils = require('./lib/utils');
const plasma = module.exports = {};

var type = utils.type;
var arrayify = utils.arrayify;
var detectPattern = utils.detectPattern;
var namespaceFiles = utils.namespaceFiles;
var namespaceObject = utils.namespaceObject;


var pathObject = function(filepath) {
  return {
    extname: path.extname(filepath),
    basename: path.basename(filepath, path.extname(filepath)),
    dirname: file.lastDir(filepath)
  };
};


var namespaceFiles = function(name, src, options) {
  var detectedName = detectPattern(name);
  var filesArray = [];

  var patterns = glob.find(src, options);
  var patternsLen = patterns.length;

  for (var j = 0; j < patternsLen; j++) {
    var filepath = patterns[j];
    var objectName = pathObject(filepath)[detectedName];

    filesArray = filesArray.concat({__normalized__: true, name: objectName, src: [filepath]});
  }
  return filesArray;
};

var namespaceObject = function(name, src, options) {
  options = options || {};
  name = detectPattern(name);
  var hash = {}, data = {}, len = src.length;

  for (var i = 0; i < len; i++) {
    var filepath = src[i];
    if(options.expand && options.expand === false) {
      hash[name] = filepath;
    } else {
      // hash[name] = file.readDataSync(filepath);
    }
    _.extend(data, hash);
  }

  return data;
};

var isNormalized = function(arr) {
  return arr.map(function(obj) {
    return _.extend({__normalized__: true}, obj);
  });
};

var typeInArray = function(value) {
  return value.map(function(item) {
    return type(item);
  })[0];
};


/**
 * Convert a string to an object with `expand` and `src` properties
 * Also adds the `__normalized__` heuristic, so that augmented
 * properties can be unset later.
 *
 * @param   {String}  str  The string to convert
 * @return  {Object}
 *
 * @api public
 */

plasma.normalizeString = function(str, options) {
  var files = glob.find(str);
  if (files.length < 1) {
    return str;
  }
  return {__normalized__: true, src: files};
};

/**
 * Normalize an array of strings to an array of objects,
 * each with `expand` and `src` properties
 *
 * @param   {Array}  arr  Array of strings
 * @return  {Array}       Array of objects
 *
 * @api public
 */

plasma.normalizeArray = function (arr, options) {
  var data = [], strings = [], objects = [], files = [];
  options = options || {};

  arr.forEach(function (value) {
    if (type(value) === 'object') {
      objects.push(value);
    } else if (type(value) === 'string') {
      var patterns = glob.find(value, options);
      if (patterns.length < 1) {
        strings = strings.concat(value);
      } else {
        files = files.concat(patterns);
      }
    }
  });

  if (strings.length > 0) {
    data = data.concat(strings);
  }

  if (files.length > 0) {
    data = data.concat({__normalized__: true, src: files});
  }

  if (objects.length > 0) {
    objects.forEach(function(obj) {
      data = data.concat(plasma.normalizeObject(obj, options));
    });
  }

  return data;
};


/**
 * Normalize an object
 *
 * @api public
 */

plasma.normalizeObject = function (config, options) {
  var data = [], hash = {}; options = options || {};

  if ('expand' in config) {
    options.expand = config.expand;
    delete config.expand;
  }

  if ('cwd' in config) {
    options.cwd = config.cwd;
    delete config.cwd;
  }

  if ('src' in config) {
    config.src = arrayify(config.src);

    if ('name' in config) {

      if (typeof config.name === 'string') {
        // If config.name looks like a prop string, try to
        // match it to a method on the path module, then use the
        // method to generate the name of the object for each file.
        //
        //   {'name': ':basename', src: ['a/*.json', 'b/*.json']}
        //
        if (detectPattern(config.name)) {
          data = data.concat(namespaceFiles(config.name, config.src, options));
        } else {
          // {'name': 'fez', src: ['*.json']}
          var files = glob.find(config.src);
          data = data.concat({__normalized__: true, name: config.name, src: files});
        }
      } else if (typeof config.name === 'function') {
        // {'name': function(src) { return src; }, src: ['*.json']}
        data = data.concat(config.name(config.src));
      }

    } else {
      config.__normalized__ = true;
      data = data.concat(config);
    }
  } else {
    config.__normalized__ = true;
    data = data.concat(config);
  }

  return data;
};


/**
 * Normalize config values to an array of objects.
 * If an object is passed in directly, it will not be modified.
 * If a string is passed in, it will be converted to an object
 * with `expand` and `src` properties.
 * If an array is passed in, each string in the array will be
 * converted to an object with `expand` and `src` properties.
 *
 * @param   {String|Object|Array}  config
 * @return  {Array} array of normalized config objects
 *
 * @api public
 */

plasma.normalize = function(config, options) {
  var data = [];

  log.verbose.inform('normalizing');

  if (type(config) === 'string') {
    data = data.concat(plasma.normalizeString(config, options));
  } if (type(config) === 'array') {
    data = data.concat(plasma.normalizeArray(config, options));
  } if (type(config) === 'object') {
    data = data.concat(plasma.normalizeObject(config, options));
  }

  return data;
};


/**
 * Expand src properties in objects that have
 * 'expand:true' defined
 *
 * @param   {Array}  arr      Array of objects
 * @param   {Object} options  Options to pass to Globule
 * @return  {Array}  array of object with expanded src files
 *
 * @api public
 */

plasma.expand = function(config, options) {
  options = options || {};
  config = plasma.normalize(config, options);

  var data = [], len = config.length, files = [];

  for (var i = 0; i < len; i++) {
    var obj = config[i];
    if ((obj.expand && obj.expand !== false) && 'src' in obj) {
      obj.src = glob.find(_.defaults(options, {nonull: true}, obj));
      obj.src = utils.normalizeNL(obj.src);
      delete obj.nonull;
    }

    if ('name' in obj && 'src' in obj) {
      // If `:pattern` is used in obj.name, that means
      // we want to add the data from each file in the `src`
      // array to a pattern that matches a corresponding node.path method.
      // e.g. if `:basename` is used, each file will be added to an
      // object named after the basename of the file.
      if (detectPattern(obj.name)) {
        files = namespaceFiles(obj.src, detectPattern(obj.name));
      }
    }

    data = data.concat(obj);
  }

  return _.merge(data, files);
};


/**
 * [load description]
 * @param   {[type]}  arr      [description]
 * @param   {[type]}  options  [description]
 * @return  {[type]}           [description]
 */

plasma.load = function(config, options) {
  options = options || {};
  config = _.cloneDeep(config);
  var orig = config;

  config = plasma.expand(config, options);
  var data = {}, name = {}, len = config.length;

  for (var i = 0; i < len; i++) {
    var obj = config[i];

    if ((obj.expand && obj.expand !== false) && 'src' in obj) {
      var srcLen = obj.src.length;
      var meta = {}, hash = {}, hashCache = {};
      for (var j = 0; j < srcLen; j++) {
        var src = obj.src[j];
        if ('hash' in obj && 'name' in obj) {
          if (file.exists(src)) {
            _.merge(hashCache, file.readDataSync(src));
          } else {
            _.merge(hashCache, src);
          }
        } else {
          if (file.exists(src)) {
            _.merge(meta, file.readDataSync(src));
          } else {
            _.merge(meta, src);
          }
        }
      }

      if ('hash' in obj && 'name' in obj) {
        hash[obj.name] = hashCache;
        _.merge(meta, expandHash(hash) || {});
        delete obj.hash;
        delete obj.name;
      }

      if ('name' in obj) {
        name[obj.name] = meta;
        _.merge(data, name);
        if (!options.retain) {
          delete obj.name;
        }
      } else {
        _.merge(data, meta);
      }

      if (!options.retain) {
        delete obj.expand;
        delete obj.src;
      }

    } else {
      _.merge(data, obj);
    }

    if ('name' in obj && 'src' in obj) {
      obj.src = arrayify(obj.src);

      _.merge(data, namespaceObject(obj.name, obj.src));

      if (!options.retain) {
        delete data.name;
        delete data.src;
      }

    } else {
      _.merge(data, obj);
    }
  }
  // Clean up temporary props from normalized objects
  if ('__normalized__' in data) {
    delete data.__normalized__;
    delete data.expand;
    delete data.src;
  }

  return {
    orig: orig,
    data: data
  };
};



/**
 * Process config templates
 * @param   {[type]}  obj      [description]
 * @param   {[type]}  options  [description]
 * @return  {[type]}           [description]
 */

plasma.process = function(obj, options) {
  var result = {};

  obj = plasma.load(obj, options || {});
  Object.keys(obj).forEach(function(key) {
    result[key] = expander.process(obj, obj[key], options || {});
  });

  return result;
};