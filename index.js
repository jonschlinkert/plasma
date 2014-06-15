/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const path   = require('path'),
  file       = require('fs-utils'),
  expander   = require('expander'),
  expandHash = require('expand-hash'),
  log        = require('verbalize'),
  _          = require('lodash');

const utils     = require('./lib/utils'),
  renameProp    = utils.renameProp,
  type          = utils.type,
  arrayify      = utils.arrayify,
  detectPattern = utils.detectPattern


var namespaceFiles = function(configObject, options) {
  var config = _.cloneDeep(configObject);
  options = options || {};
  var data = [];

  var namespace = config.namespace;
  var src = config.src;

  delete config.namespace;
  delete src.namespace;

  var files = file.expand(src, options);
  var len = files.length;

  if (len === 0) {
    data = data.concat({
      __normalized__: true,
      nomatch: src
    });
  } else {
    for (var j = 0; j < len; j++) {
      var filepath = files[j];
      var newname = renameProp(namespace, filepath);
      data = data.concat({
        __normalized__: true,
        namespace: newname,
        src: [filepath]
      });
    }
  }

  if (config.hasOwnProperty('dothash')) {
    var hash = {}, content = {};
    delete config.dothash;
    data.forEach(function(obj) {
      obj.src.map(function(filepath) {
        content.namespace = renameProp(namespace, filepath);
        delete obj.namespace;
        content.src = file.readDataSync(filepath, options);
        delete obj.src;
      });
      delete hash.namespace;
      hash.__normalized__ = true;
      hash[content.namespace] = content.src;
      hash = expandHash(hash);
    });
    data = data.concat(hash);
  }

  return data.map(function(obj) {
    return _.defaults(obj, config);
  });
};


/**
 * ## .plasma(config, options)
 *
 * @method  plasma
 * @param   {Object} `config`
 * @param   {Object} `options`
 * @return  {Object}
 */

function plasma (config, options) {
  return plasma.load(config, options).data;
}


/**
 * Return an array of `require`able modules. Proxy for `.loadNpm` and `.loadLocal`.
 *
 * @param   {Object} `config`
 * @param   {Object} `options`
 * @return  {Function}
 */

plasma.fn = function(config, options) {
  return plasma.load(config, options).modules.resolved;
};


/**
 * Load npm modules from a normalized config
 * @param   {Object}  mod
 * @param   {Object}  params
 * @return  {Object}
 */

plasma.loadNpm = function(modules, options) {
  options = options || {};

  var names    = modules.nomatch,
    config     = options.config || {},
    resolved   = {},
    unresolved = [];

  names.forEach(function(name) {
    try {
      _.merge(resolved, require(name)(config));
    } catch (err) {
      try {
        _.merge(resolved, require(name));
      } catch(err) {
        unresolved = unresolved.concat(name);
      }
    }
  });

  return {
    __normalized__: true,
    resolved      : resolved   || {},
    unresolved    : unresolved || [],
    nomatch       : unresolved || []
  };
};


/**
 * Load local modules from a normalized config
 * @param   {Object}  `filepath`
 * @param   {Object}  `params`
 * @return  {Object}
 */

plasma.loadLocal = function(modules, options) {
  options = options || {};

  var filepaths = modules.src,
    config      = options.config || {},
    resolved    = {},
    unresolved  = [];

  filepaths.forEach(function(filepath) {
    filepath = path.resolve(filepath);
    try {
      _.merge(resolved, require(filepath)(config));
    } catch (err) {
      try {
        _.merge(resolved, require(filepath));
      } catch (err) {
        unresolved = unresolved.concat(filepath);
      }
    }
  });

  return {
    __normalized__: true,
    resolved      : resolved   || {},
    unresolved    : unresolved || [],
    nomatch       : unresolved || []
  };
};


/**
 * Convert a string to an object with `expand` and `src` properties
 * Also adds the `__normalized__` heuristic, so that augmented
 * properties can be unset later.
 *
 * @param   {String}  `str`  The string to convert
 * @return  {Object}
 * @api public
 */

plasma.normalizeString = function(pattern, options) {
  if (path.extname(pattern) === '.js' || path.extname(pattern) === '.coffee' || !file.ext(pattern)) {
    var files = file.expand(pattern, options);
    if (files.length > 0) {
      return plasma.normalize({__fn__: true, __normalized__: true, src: files}, options);
    } else {
      return plasma.loadNpm({__fn__: true, __normalized__: true, nomatch: [pattern]}, options);
    }
  }
  return plasma.normalize({src: [pattern]}, options);
};

/**
 * Normalize an array of strings to an array of objects,
 * each with `expand` and `src` properties
 *
 * @param   {Array}  `arr`  Array of strings
 * @return  {Array}  Array of objects
 * @api public
 */

plasma.normalizeArray = function (config, options) {
  var arr = _.cloneDeep(config);
  options = options || {};

  var data    = [],
    functions = [],
    strings   = [],
    objects   = [],
    arrays    = [],
    files     = [];

  arr.forEach(function (value) {
    if (type(value) === 'object') {
      objects = objects.concat(value);
    } else if (type(value) === 'string') {
      var patterns = file.expand(value, options);
      if (patterns.length < 1) {
        strings = strings.concat(value);
      } else {
        if (path.extname(patterns[0]) === '.js') {
          functions = functions.concat({
            __normalized__: true,
            __fn__: true,
            src: patterns
          });
        } else {
          files = files.concat(patterns);
        }
      }
    } else {
      arrays.push(value);
    }
  });

  if (functions.length > 0) {
    functions.forEach(function(fn) {
      data = data.concat(fn);
    });
  }

  if (files.length > 0) {
    data = data.concat({__normalized__: true, src: files});
  }

  if (strings.length > 0) {
    strings.forEach(function(str) {
      data = data.concat(plasma.normalize(str, options));
    });
  }

  if (arrays.length > 0) {
    arrays.forEach(function(arr) {
      data = data.concat(plasma.normalize(arr, options));
    });
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

  var data = [],
    files;

  // If both `src` and `namespace` exist, then we need to namespace
  // the data loaded from `src`, unless `__namespace__: false`
  // was defined earlier or by the user.

  if (obj.hasOwnProperty('src') && obj.hasOwnProperty('namespace')) {
    obj.__namespace__ = obj.__namespace__ || true;
  }

  // Allow a function to customizie how the config is processe.
  if (obj.hasOwnProperty('processConfig') && type(obj.processConfig) === 'function') {
    obj = plasma.normalize(obj.processConfig(obj));
  }

  if (obj.hasOwnProperty('expand')) {
    options.expand = obj.expand;
    delete obj.expand;
  }

  if (obj.cwd) {
    options.cwd = obj.cwd;
  }

  if (obj.prefixBase) {
    options.prefixBase = obj.prefixBase;
    delete obj.prefixBase;
  }

  // If the user has defined 'functions',
  // then normalize the object so that we
  // can try to require the modules later
  if (obj.hasOwnProperty('functions') || options.hasOwnProperty('functions')) {
    obj.__fn__ = true;
    obj.__normalized__ = true;
    delete obj.functions;
    delete options.functions;
  }

  if (obj.hasOwnProperty('__fn__')) {
    if (obj.hasOwnProperty('src')) {
      // if ther is a src property, try to expand
      // it to see if the modules are local.
      files = file.expand(obj.src, options);
      if (files.length > 0) {
        obj.src = files;
      } else {
        obj.nomatch = [];
        // if globule returns an empty array
        // then let's put the original src
        // patterns into nomatch so we can try
        // to require them from npm later.
        obj.nomatch = obj.nomatch.concat(obj.src);
      }
    }
    data = data.concat(obj);

  } else if (obj.__namespace__) {
    obj.src = arrayify(obj.src);

    // Prop strings
    //
    // If obj.namespace looks like a prop string, try to
    // match it to a method on the path module, then use the
    // method to generate the name of the object for each file.
    //
    //   {'namespace': ':basename', src: ['a/*.json', 'b/*.json']}

    if (detectPattern(obj.namespace)) {
      data = data.concat(namespaceFiles(obj, options));

    } else {
      files = file.expand(obj.src, options);

      if (path.extname(files[0]) === '.js' || options.functions) {
        data = data.concat(_.extend(obj, {
          __normalized__: true,
          __fn__: true,
          src: files
        }));
      } else {

        // If `expand: false` is set, don't load the data defined in src,
        // just rename the `src` key to the value defined in `namespace`.
        if (options.expand === false) {
          obj[obj.namespace] = obj.src;

          // Now, delete name and src so this object isn't evaluated again.
          delete obj.namespace;
          obj = _.extend(obj, {__normalized__: true});
          data = data.concat(obj);

        } else if (files.length > 0) {

          // Otherwise, proceed with namespacing. We need to create a structure like this
          // => {'namespace': 'fez', src: ['*.json']}

          // If globule returned files, we'll add them to the src array.
          obj = _.extend(obj, {__normalized__: true, namespace: obj.namespace, src: files});
          data = data.concat(obj);

        } else {

          // But if no files are actually found, then, then push the original src value
          // to the `nomatch` array.
          obj.nomatch = obj.nomatch || [];
          obj[obj.namespace] = obj.src;
          obj = _.extend(obj, {
            __normalized__: true,
            namespace: obj.namespace,
            nomatch: obj.nomatch.concat(obj.src)
          });

          // Since no src files were found, we need to get rid of obj.namespace and obj.src,
          // so they aren't evaluated again in the process.
          delete obj.namespace;
          data = data.concat(obj);
        }
      }
    }

  } else if (obj.namespace && !obj.src) {
    // If no `src` is in obj, let's just return the object as-is,
    // since we can assume that `namespace` has a different purpose.
    obj.__normalized__ = true;
    data = data.concat(obj);

  } else if (obj.hasOwnProperty('src') && !obj.namespace) {

    // If a `src` does exists but `namespace` doesn't, we need to load
    // in the data from src and extend the root object directly.
    var srcfiles = file.expand(obj.src, options);
    var srcObj = {};

    if (srcfiles.length === 0) {
      // If we don't get any files back from globule,
      // push the original src value into `nomatch`
      var origSrc = obj.src;

      obj.nomatch = obj.nomatch || [];
      srcObj = _.defaults({nomatch: obj.nomatch.concat(origSrc) }, obj);
      data = data.concat(_.merge({__normalized__: true }, srcObj));

    } else {
      // If we actually get files back from globule, first check to see if they
      // might be node modules, if not, add the files array to the src property
      // and extend the object with missing values from the original config.
      if (path.extname(obj.src) === '.js') {
        return plasma.normalize({__fn__: true, __normalized__: true, src: srcfiles}, options);
      } else {
        srcObj = _.defaults({src: srcfiles}, obj);
        data = data.concat(_.merge({__normalized__: true }, srcObj));
      }
    }

  } else {
    // If we missed any scenarios, just return the object as-is
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

plasma.load = function(obj, options) {
  options = options || {};
  config = _.cloneDeep(obj);
  var orig    = config,
    nomatch   = [],
    data      = {},
    namespace = {},
    modules   = {};

  if(options.cwd) {
    options.prefixBase = true;
  }

  // First, normalize config values
  config = plasma.normalize(config, options);
  config.forEach(function (obj) {
    if (obj.hasOwnProperty('dothash')) {
      options.dothash = obj.dothash;
      delete obj.dothash;
    }

    if (obj.hasOwnProperty('nomatch')) {
      nomatch = nomatch.concat(obj.nomatch);
    }


    // If the object has not been normalize, we could run `plasma.normalize` here,
    // but something is probably amiss, so throw an error instead.
    if (!obj.__normalized__) {
      throw new Error('  [plasma]: config should be normalized by this point, something has gone awry.');
    }

    // Everything looks good, proceed...

    if (obj.hasOwnProperty('resolved')) {
      _.merge(modules, obj);
    }

    if (obj.hasOwnProperty('__fn__')) {
      if (obj.hasOwnProperty('nomatch')) {
        obj.nomatch.forEach(function(item) {
          if (path.extname(item) === '.js' || path.extname(item) === '.coffee') {
            _.merge(modules, plasma.loadNpm(obj, options));
          }
        });
      }

      if (obj.hasOwnProperty('src')) {
        _.merge(modules, plasma.loadLocal(obj, options));
      }

    } else if ((!obj.namespace && !obj.src) || (obj.expand && obj.hasOwnProperty('src'))) {
      // If neither a namespace, nor a src key exist it's probably just an object of data,
      // so merge it into the context. Similarly, if `expand: false` was defined,
      // then we want to leave the src value as-is.
      _.merge(data, obj);

    // Otherwise, continue with expansion.
    } else {
      var meta = {}, hash = {}, hashCache = {};
      // src should be an array of files by this point.

      _.forEach(obj.src, function (filepath) {
        if (file.exists(filepath)) {
          if (options.hasOwnProperty('dothash') && obj.hasOwnProperty('namespace')) {
            _.merge(hashCache, file.readDataSync(filepath, options));
          } else if (obj.hasOwnProperty('namespace') && obj.hasOwnProperty('src')) {
            namespace[obj.namespace] = file.readDataSync(filepath, options);
            _.merge(meta, namespace);

            if (!options.retainKeys) {
              delete obj.namespace;
            }

          } else if (!obj.namespace && obj.hasOwnProperty('src')) {
            var srcData = file.readDataSync(filepath, options);
            _.merge(meta, srcData);
          }
        } else {
          nomatch = nomatch.concat(filepath);
        }
      });

      // Now that we're out of the loop, merge the hashCash
      // object into the meta object.
      if (options.hasOwnProperty('dothash') && obj.hasOwnProperty('namespace')) {
        hash[obj.namespace] = hashCache;
        _.merge(meta, expandHash(hash) || {});
        delete obj.dothash;
        delete obj.namespace;
      }

      if (!options.retainKeys) {
        delete obj.expand;
      }

      _.merge(data, obj, meta || {});
    }

    // If dothash:true is still in the options, that means an
    // object's keys should be expanded, instead of the value
    // of `namespace`.
    if (options.hasOwnProperty('dothash')) {
      data = expandHash(data);
      delete data.dothash;
    }

  });

  // Clean up temporary props from normalized objects
  if (data.hasOwnProperty('__normalized__')) {
    nomatch = nomatch.concat(data.nomatch);
    delete data.__normalized__;
    delete data.__namespace__;
    delete data.__fn__;
    delete data.nomatch;
    delete data.expand;
    delete data.src;
  }

  return {
    orig: orig,
    nomatch: _.unique(nomatch).filter(Boolean),
    data: data || {},
    modules: {
      resolved: modules.resolved || {},
      unresolved: modules.unresolved || []
    }
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

  obj = plasma(obj, options || {});
  result = expander.process(obj, obj, options || {});

  return result;
};


module.exports = plasma;