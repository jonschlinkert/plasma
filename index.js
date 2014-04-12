/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const file = require('fs-utils');
const expander = require('expander');
const replace = require('frep');
const expandHash = require('expand-hash');
const log = require('verbalize');
const _ = require('lodash');

const utils = require('./lib/utils');
const plasma = module.exports = {};

var type = utils.type;
var arrayify = utils.arrayify;
var detectPattern = utils.detectPattern;

var renameProp = function(str, filepath) {
  var replacements = {
    ':basename': file.name(filepath),
    ':dirname': file.lastDir(filepath)
  };
  return replace.strWithObj(str, replacements);
};

var namespaceFiles = function(configObject, options) {
  var config = _.cloneDeep(configObject);
  options = options || {};
  var data = [];

  var name = config.name;
  var src = config.src;
  delete config.name;
  delete src.name;

  var files = file.expand(src, options);
  var len = files.length;

  if (len === 0) {
    data = data.concat({
      name: name,
      nomatch: src
    });
  } else {
    for (var j = 0; j < len; j++) {
      var filepath = files[j];
      var newname = renameProp(name, filepath);
      data = data.concat({
        __normalized__: true,
        name: newname,
        src: [filepath]
      });
    }
  }

  if ('dothash' in config) {
    var hash = {}, content = {};
    delete config.dothash;
    data.forEach(function(obj) {
      obj.src.map(function(filepath) {
        content.name = renameProp(name, filepath);
        delete obj.name;
        content.src = file.readDataSync(filepath);

        delete obj.src;
      });
      delete hash.name;
      hash[content.name] = content.src;
      hash.__normalized__ = true;
      hash = expandHash(hash);
    });
    data = data.concat(hash);
  }

  return data.map(function(obj) {
    return _.defaults(obj, config);
  });
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

plasma.normalizeString = function(patterns, options) {
  return plasma.normalize({src: [patterns]}, options);
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

plasma.normalizeArray = function (config, options) {
  var arr = _.cloneDeep(config);
  var data = [], strings = [], objects = [], arrays = [];
  options = options || {};

  var files = [];
  arr.forEach(function (value) {
    if (type(value) === 'object') {
      objects = objects.concat(value);
    } else if (type(value) === 'string') {
      var patterns = file.expand(value, options);
      if (patterns.length < 1) {
        strings = strings.concat(value);
      } else {
        files = files.concat(patterns);
      }
    } else {
      arrays.push(value);
    }
  });

  if (arrays.length > 0) {
    arrays.forEach(function(arr) {
      data = data.concat(plasma.normalize(arr, options));
    });
  }

  if (strings.length > 0) {
    data = data.concat({__normalized__: true, nomatch: strings});
  }

  if (files.length > 0) {
    data = data.concat({__normalized__: true, src: files});
  }

  if (objects.length > 0) {
    objects.forEach(function(obj) {
      data = data.concat(plasma.normalize(obj, options));
    });
  }

  return data;
};


/**
 * Normalize an object
 *
 * @api public
 */


plasma.normalizeObject = function (obj, options) {
  options = options || {};
  options.expand = options.expand || true;

  var data = [];

  // `processConfig` function
  if ('processConfig' in obj && type(obj.processConfig) === 'function') {
    obj = plasma.normalize(obj.processConfig(obj));
  }

  if ('expand' in obj) {
    options.expand = obj.expand;
    delete obj.expand;
  }

  if ('cwd' in obj) {
    options.cwd = obj.cwd;
    delete obj.srcBase;
    delete obj.cwd;
  }

  if ('prefixBase' in obj) {
    options.prefixBase = obj.prefixBase;
    delete obj.srcBase;
    delete obj.prefixBase;
  }

  if ('name' in obj && !obj.src) {
    // If no `src` is found, return the object as-is
    obj.__normalized__ = true;
    data = data.concat(obj);
  } else if ('src' in obj && !obj.name) {
    var srcfiles = file.expand(obj.src, options);
    var srcObj = {};
    if (srcfiles.length === 0) {
      var origSrc = obj.src;
      delete obj.src;
      srcObj = _.defaults({nomatch: origSrc}, obj);
    } else {
      srcObj = _.defaults({src: srcfiles}, obj);
    }
    data = data.concat(_.merge({__normalized__: true}, srcObj));
  } else if ('name' in obj && 'src' in obj) {
    obj.src = arrayify(obj.src);

   /**
    * If obj.name looks like a prop string, try to
    * match it to a method on the path module, then use the
    * method to generate the name of the object for each file.
    *
    *   {'name': ':basename', src: ['a/*.json', 'b/*.json']}
    */

    if (detectPattern(obj.name)) {
      data = data.concat(namespaceFiles(obj, options));
    } else {
      var files = file.expand(obj.src, options);

      if (options.expand === false) {
        obj[obj.name] = obj.src;
        delete obj.src;
      }

      /**
       *  => {'name': 'fez', src: ['*.json']}
       */

      if (files.length > 0) {
        obj = _.extend({}, obj, {__normalized__: true, name: obj.name, src: files});
        data = data.concat(obj);
      } else {
        obj[obj.name] = obj.src;
        obj = _.extend({}, obj, {__normalized__: true, name: obj.name, nomatch: obj.src});
        delete obj.name;
        delete obj.src;
        data = data.concat(obj);
      }
    }
  } else {
    // If no `src` is found, return the object as-is
    obj.__normalized__ = true;
    data = data.concat(obj);
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

plasma.normalize = function(value, options) {
  options = options || {};
  var config = _.cloneDeep(value);
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
 * [load description]
 * @param   {[type]}  arr      [description]
 * @param   {[type]}  options  [description]
 * @return  {[type]}           [description]
 */

plasma.load = function(config, options) {
  options = options || {};
  config = _.cloneDeep(config);
  var orig = config, nomatch = [];

  config = plasma.normalize(config, options);
  var data = {}, name = {};
  config.forEach(function (obj) {

    if ('dothash' in obj) {
      options.dothash = obj.dothash;
    }

    if ('nomatch' in obj) {
      nomatch = nomatch.concat(obj.nomatch);
    }

    if (!obj.__normalized__) {
      throw new Error('Config should be normalized. Something has gone awry.');
    } else {

      if (!obj.name && !obj.src) {
        _.merge(data, obj);
      } else if ((obj.expand && obj.expand !== false) && 'src' in obj) {
        _.merge(data, obj);
      } else {
        var meta = {}, hash = {}, hashCache = {};

        _.forEach(obj.src, function (filepath) {

          if ('dothash' in options && 'name' in obj) {
            if (file.exists(filepath)) {
              _.merge(hashCache, file.readDataSync(filepath));
            } else {
              nomatch = nomatch.concat(filepath);
            }
          } else {
            if (file.exists(filepath)) {
              _.merge(meta, file.readDataSync(filepath));
            } else {
              nomatch = nomatch.concat(filepath);
            }
          }
        });

        if ('dothash' in obj && 'name' in obj) {
          hash[obj.name] = hashCache;
          _.merge(meta, expandHash(hash) || {});
          delete obj.dothash;
          delete obj.name;
        }

        if ('name' in obj && 'src' in obj) {
          name[obj.name] = meta;
          _.merge(data, name);
          if (!options.retainKeys) {
            delete obj.name;
          }
        } else {
          _.merge(data, meta || {});
        }

        if (!options.retainKeys) {
          delete obj.expand;
          delete obj.src;
        }

      }
      _.merge(data, obj);
    }
  });

  // Clean up temporary props from normalized objects
  if ('__normalized__' in data) {
    nomatch = nomatch.concat(data.nomatch);
    delete data.__normalized__;
    delete data.nomatch;
    delete data.expand;
    delete data.src;
  }

  nomatch = _.unique(nomatch);
  if (type(nomatch[0]) === 'undefined') {
    nomatch = [];
  }

  return {
    orig: orig,
    nomatch: nomatch,
    data: data || {}
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

  obj = plasma.load(obj, options || {}).data;
  Object.keys(obj).forEach(function(key) {
    result[key] = expander.process(obj, obj[key], options || {});
  });

  return result;
};